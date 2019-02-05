import {
  Component, OnInit, Input, Output,
  EventEmitter
} from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';

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

  @Output() newMapView = new EventEmitter<models.MapViewType>();
  @Output() newMapDrawMode = new EventEmitter<models.MapDrawModeType>();
  @Output() newMapInteractionMode = new EventEmitter<models.MapInteractionModeType>();
  @Output() loadUrlState = new EventEmitter<void>();

  private isInitMap = true;

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

  private granulePolygonsLayer(projection: string): Observable<VectorSource> {
    return this.granules$.pipe(
      map(granules => granules
        .map(g => g.metadata.polygon)
        .map(wkt =>
          this.wktService.wktToFeature(wkt, projection)
        )
      ),
      map(features => new VectorLayer({
        source: new VectorSource({ features })
      }))
    );
  }

  private setMapWith(viewType: models.MapViewType): void {
    this.mapService.setMapView(viewType);
  }
}
