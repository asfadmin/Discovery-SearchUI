import {
  Component, OnInit, Input, Output,
  EventEmitter
} from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap, tap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';

import { Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import * as models from '@models';
import { MapService, WktService } from '@services';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<models.Sentinel1Product[]>;
  @Input() view$: Observable<models.MapViewType>;
  @Input() drawMode$: Observable<models.MapDrawModeType>;
  @Input() interactionMode$: Observable<models.MapInteractionModeType>;
  @Input() focusedGranule$: Observable<models.Sentinel1Product>;

  @Output() newMapView = new EventEmitter<models.MapViewType>();
  @Output() newMapDrawMode = new EventEmitter<models.MapDrawModeType>();
  @Output() newMapInteractionMode = new EventEmitter<models.MapInteractionModeType>();
  @Output() loadUrlState = new EventEmitter<void>();

  private isInitMap = true;
  public mousePosition$ = this.mapService.mousePosition$;

  constructor(
    private mapService: MapService,
    private wktService: WktService,
  ) {}

  ngOnInit(): void {
    this.updateMapOnViewChange();
    this.redrawSearchPolygonWhenViewChanges();
    this.updateDrawMode();

    this.interactionMode$
      .subscribe(mode => this.mapService.setInteractionMode(mode));

    this.focusedGranule$.subscribe(_ => _);
  }

  public onNewProjection(view: models.MapViewType): void {
    this.newMapView.emit(view);
  }

  public onNewDrawMode(mode: models.MapDrawModeType): void {
    this.newMapDrawMode.emit(mode);
  }

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.newMapInteractionMode.emit(mode);
  }

  public onFileHovered(e): void {
    this.newMapInteractionMode.emit(models.MapInteractionModeType.UPLOAD);
    e.preventDefault();
  }

  private updateMapOnViewChange(): void {
    this.view$.pipe(
      map(view => this.setMapWith(view)),

      // Load state from url after map is set
      tap(() => {
        if (this.isInitMap) {
          this.loadUrlState.emit();
        }

        this.isInitMap = false;
      }),

      switchMap(_ =>
        this.granulePolygonsLayer(this.mapService.epsg())
      )
    ).subscribe(
      layer => this.mapService.setLayer(layer)
    );

    this.focusedGranule$.pipe(
      filter(_ => !this.isInitMap),
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

  private loadSearchPolygon = (polygon: string): void => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);
  }

  public onNewSearchPolygon(polygon: string): void {
    this.loadSearchPolygon(polygon);
  }

  public onFileUploadDialogClosed(): void {
    this.newMapInteractionMode.emit(models.MapInteractionModeType.EDIT);
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
