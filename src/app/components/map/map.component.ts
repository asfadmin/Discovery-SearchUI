import {
  Component, OnInit,
  Input, Output,
  EventEmitter
} from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { WKT } from 'ol/format';
import { Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { Sentinel1Product, MapViewType, MapDrawModeType } from '@models';
import { MapService, UrlStateService } from '@services';


@Component({
  selector: 'app-map',
  template: `
    <div id="map" class="map"></div>

    <app-view-selector
      (newProjection)="onNewProjection($event)"
      [view]="view$ | async">
    </app-view-selector>

    <app-draw-selector
      (newDrawMode)="onNewDrawMode($event)">
    ></app-draw-selector>
  `,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<Sentinel1Product[]>;
  @Input() view$: Observable<MapViewType>;
  @Input() drawMode$: Observable<MapDrawModeType>;

  @Output() newMapView = new EventEmitter<MapViewType>();
  @Output() newMapDrawMode = new EventEmitter<MapDrawModeType>();
  @Output() loadUrlState = new EventEmitter<void>();

  private isInitMap = true;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.view$.pipe(
      map(view => this.setMapWith(view)),

      tap(() => {
        if (this.isInitMap) {
          this.loadUrlState.emit();
        }

        this.isInitMap = false;
      }),


      switchMap(_ =>
        this.granulePolygonsLayer(this.mapService.epsg())
      ),
    ).subscribe(
      layer => this.mapService.setLayer(layer)
    );

    this.view$.pipe(
      withLatestFrom(this.mapService.searchPolygon$),
      map(([_, polygon]) => polygon),
      filter(polygon => !!polygon),
    ).subscribe(
      polygon => this.loadSearchPolygon(polygon)
    );

    this.drawMode$.subscribe(
      mode => this.mapService.setDrawMode(mode)
    );
  }

  public loadSearchPolygon = (polygon: string): void => {
    const format = new WKT();
    const granuleProjection = 'EPSG:4326';

    const features = format.readFeature(polygon, {
      dataProjection: granuleProjection,
      featureProjection: this.mapService.epsg()
    });

    this.mapService.setDrawFeature(features);
  }

  public onNewProjection(view: MapViewType): void {
    this.newMapView.emit(view);
  }

  public onNewDrawMode(mode: MapDrawModeType): void {
    this.newMapDrawMode.emit(mode);
  }

  private setMapWith(viewType: MapViewType): void {
    this.mapService.setMapView(viewType);
  }

  private granulePolygonsLayer(projection: string): Observable<VectorSource> {
    const wktFormat = new WKT();
    const granuleProjection = 'EPSG:4326';

    return this.granules$.pipe(
      map(granules => granules
        .map(g => g.metadata.polygon)
        .map(wkt =>
          wktFormat.readFeature(wkt, {
            dataProjection: granuleProjection,
            featureProjection: projection
          })
        )
      ),
      map(features => new VectorLayer({
        source: new VectorSource({ features })
      }))
    );
  }
}
