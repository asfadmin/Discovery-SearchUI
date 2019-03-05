import {
  Component, OnInit, Input, Output,
  EventEmitter
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap, tap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';

import { Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as queueStore from '@store/queue';

import * as models from '@models';
import { MapService, WktService } from '@services';
import { QueueComponent } from './queue';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Output() loadUrlState = new EventEmitter<void>();

  public showSettings = false;

  public view$ = this.store$.select(mapStore.getMapView);
  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public isMapInitialized$ = this.store$.select(mapStore.getIsMapInitialization);
  public isDrawMenuDisabled$ = this.interactionMode$.pipe(
    map(mode => mode !== models.MapInteractionModeType.DRAW)
  );

  public granules$ = this.store$.select(granulesStore.getGranules);
  public focusedGranule$ = this.store$.select(granulesStore.getFocusedGranule);
  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);

  public mousePosition$ = this.mapService.mousePosition$;

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private wktService: WktService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.updateMapOnViewChange();
    this.redrawSearchPolygonWhenViewChanges();
    this.updateDrawMode();

    this.interactionMode$
      .subscribe(mode => this.mapService.setInteractionMode(mode));
  }

  public onNewProjection(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public onToggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  public onOpenDownloadQueue(): void {
    this.dialog.open(QueueComponent, {
      width: '450px',
    });
  }

  public onNewDrawMode(mode: models.MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onFileHovered(e): void {
    this.onNewInteractionMode(models.MapInteractionModeType.UPLOAD);
    e.preventDefault();
  }

  public onNewSearchPolygon(polygon: string): void {
    const features = this.loadSearchPolygon(polygon);

    this.mapService.zoomTo(features);
  }

  public onFileUploadDialogClosed(successful: boolean): void {
    if (successful) {
      this.onNewInteractionMode(models.MapInteractionModeType.EDIT);
    } else {
      this.onNewInteractionMode(models.MapInteractionModeType.DRAW);
    }
  }

  private updateMapOnViewChange(): void {
    const viewBeforInitialization = this.view$.pipe(
        withLatestFrom(this.isMapInitialized$),
        filter(([view, isInit]) => !isInit),
        map(([view, isInit]) => view)
    );

    viewBeforInitialization.subscribe(
      view => {
        this.setMapWith(view);
        this.loadUrlState.emit();
        this.store$.dispatch(new mapStore.MapInitialzed());
      }
    );

    const granulesLayerAfterInitialization = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => this.view$),
    );

    granulesLayerAfterInitialization.pipe(
      tap(view => this.setMapWith(view)),
      switchMap(_ =>
        this.granulePolygonsLayer(this.mapService.epsg())
      )
    ).subscribe(
      layer => this.mapService.setLayer(layer)
    );

    const focuseGranuleAfterInitialization = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => this.focusedGranule$),
    );

    focuseGranuleAfterInitialization.pipe(
      tap(granule => !!granule || this.mapService.clearFocusedGranule()),
      filter(g => g !== null),
      map(
        granule => this.wktService.wktToFeature(
          granule.metadata.polygon,
          this.mapService.epsg()
        )
      ),
    ).subscribe(
      feature => this.mapService.setFocusedFeature(feature)
    );
  }

  private redrawSearchPolygonWhenViewChanges(): void {
    this.view$.pipe(
      withLatestFrom(this.mapService.searchPolygon$),
      map(([_, polygon]) => polygon),
      filter(polygon => !!polygon),
    ).subscribe(
      polygon => this.loadSearchPolygon(polygon)
    );
  }

  private updateDrawMode(): void {
    this.drawMode$.subscribe(
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
    return this.granules$.pipe(
      distinctUntilChanged(),
      map(
        granules => this.granulesToFeature(granules, projection)
      ),
      map(features => this.featuresToSource(features))
    );
  }

  private granulesToFeature(granules: models.Sentinel1Product[], projection: string) {
    return granules
        .map(g => g.metadata.polygon)
        .map(wkt =>
          this.wktService.wktToFeature(wkt, projection)
        );
  }

  private featuresToSource(features): VectorSource {
    return new VectorLayer({
      source: new VectorSource({
        features, noWrap: true, wrapX: false
      })
    });
  }

  private setMapWith(viewType: models.MapViewType): void {
    this.mapService.setMapView(viewType);
  }
}
