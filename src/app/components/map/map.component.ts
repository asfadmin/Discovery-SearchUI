import {
  Component, OnInit, Input, Output, EventEmitter
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import {
  map, filter, switchMap, tap,
  withLatestFrom, distinctUntilChanged
} from 'rxjs/operators';

import { Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';

import * as models from '@models';
import { MapService, WktService } from '@services';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Output() loadUrlState = new EventEmitter<void>();

  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public mousePosition$ = this.mapService.mousePosition$;

  private isMapInitialized$ = this.store$.select(mapStore.getIsMapInitialization);
  private viewType$ = combineLatest(
    this.store$.select(mapStore.getMapView),
    this.store$.select(mapStore.getMapLayerType),
  );

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private wktService: WktService,
  ) {}

  ngOnInit(): void {
    this.updateMapOnViewChange();
    this.redrawSearchPolygonWhenViewChanges();
    this.updateDrawMode();

    this.interactionMode$.subscribe(
      mode => this.mapService.setInteractionMode(mode)
    );

    this.mapService.newSelectedGranule$.pipe(
      map(gName => new granulesStore.SetSelectedGranule(gName))
    ).subscribe(
      action => this.store$.dispatch(action)
    );
  }

  public onFileHovered(e): void {
    this.onNewInteractionMode(models.MapInteractionModeType.UPLOAD);
    e.preventDefault();
  }

  private onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onNewSearchPolygon(polygon: string): void {
    const features = this.loadSearchPolygon(polygon);

    this.mapService.zoomTo(features);
  }

  public onFileUploadDialogClosed(successful: boolean): void {
    const newMode = successful ?
      models.MapInteractionModeType.EDIT :
      models.MapInteractionModeType.NONE;

    this.onNewInteractionMode(newMode);
  }

  private updateMapOnViewChange(): void {
    const viewBeforInitialization = this.viewType$.pipe(
      withLatestFrom(this.isMapInitialized$),
      filter(([view, isInit]) => !isInit),
      map(([view, isInit]) => view)
    ).subscribe(
      ([view, layerType]) => {
        this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>layerType);
        this.loadUrlState.emit();
        this.store$.dispatch(new mapStore.MapInitialzed());
      }
    );

    this.granuleToLayer$('SELECTED').subscribe(
      feature => this.mapService.setSelectedFeature(feature)
    );

    this.granuleToLayer$('FOCUSED').subscribe(
      feature => this.mapService.setFocusedFeature(feature)
    );
  }

  private granuleToLayer$(layerType: string) {
    const granule$ = layerType === 'FOCUSED' ?
      this.store$.select(granulesStore.getFocusedGranule) :
      this.store$.select(granulesStore.getSelectedGranule);

    const granulesLayerAfterInitialization = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => this.viewType$),
    );

    granulesLayerAfterInitialization.pipe(
      tap(([view, mapLayerType]) =>
        this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>mapLayerType)
      ),
      switchMap(_ =>
        this.granulePolygonsLayer(this.mapService.epsg())
      )
    ).subscribe(
      layer => this.mapService.setLayer(layer)
    );

    const selectedGranuleAfterInitialization = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => granule$),
    );

    return selectedGranuleAfterInitialization.pipe(
      tap(granule => !!granule || (layerType === 'FOCUSED') ?
        this.mapService.clearFocusedGranule() :
        this.mapService.clearSelectedGranule()
      ),
      filter(g => g !== null),
      map(
        granule => this.wktService.wktToFeature(
          granule.metadata.polygon,
          this.mapService.epsg()
        )
      ),
    );
  }

  private redrawSearchPolygonWhenViewChanges(): void {
    this.viewType$.pipe(
      withLatestFrom(this.mapService.searchPolygon$),
      map(([_, polygon]) => polygon),
      filter(polygon => !!polygon),
    ).subscribe(
      polygon => this.loadSearchPolygon(polygon)
    );
  }

  private updateDrawMode(): void {
    this.store$.select(mapStore.getMapDrawMode).subscribe(
      mode => this.mapService.setDrawMode(mode)
    );
  }

  private loadSearchPolygon = (polygon: string) => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);

    return features;
  }


  private granulePolygonsLayer(projection: string): Observable<VectorSource> {
    return this.store$.select(granulesStore.getGranules).pipe(
      distinctUntilChanged(),
      map(granules => this.granulesToFeature(granules, projection)),
      map(features => this.featuresToSource(features))
    );
  }

  private granulesToFeature(granules: models.CMRProduct[], projection: string) {
    return granules
      .map(g => {
        const wkt = g.metadata.polygon;
        const feature = this.wktService.wktToFeature(wkt, projection);
        feature.set('filename', g.id);

        return feature;
      });
  }

  private featuresToSource(features): VectorSource {
    const layer = new VectorLayer({
      source: new VectorSource({
        features, wrapX: true,
      })
    });

    layer.set('selectable', 'true');

    return layer;
  }

  private setMapWith(viewType: models.MapViewType, layerType: models.MapLayerTypes): void {
    this.mapService.setMapView(viewType, layerType);
  }
}
