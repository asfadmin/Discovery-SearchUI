import {
  Component, OnInit,
  Input, Output,
  EventEmitter
} from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';

import { WKT } from 'ol/format';
import { Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { Sentinel1Product, MapViewType } from '@models';
import { MapService, UrlStateService } from '@services';


@Component({
  selector: 'app-map',
  template: `
    <div id="map" class="map"></div>

    <app-view-selector
      (newProjection)="onNewProjection($event)">
    </app-view-selector>
  `,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<Sentinel1Product[]>;
  @Input() view$: Observable<MapViewType>;

  @Output() newMapView = new EventEmitter<MapViewType>();
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
      switchMap(newMap =>
        this.granulePolygonsLayer(this.mapService.epsg())
      ),
    ).subscribe(
      layer => this.mapService.setLayer(layer)
    );

  }

  public onNewProjection(view: MapViewType): void {
    this.newMapView.emit(view);
  }

  private setMapWith(viewType: MapViewType): void {
    this.mapService.setMapView(viewType);
  }

  private granulePolygonsLayer(projection: string): Observable<VectorSource> {
    const wktFormat = new WKT();
    const granuleProjection = 'EPSG:4326';

    return this.granules$.pipe(
      filter(granules => granules.length > 0),
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
