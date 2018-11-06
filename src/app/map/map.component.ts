import {
  Component, OnInit,
  Input, Output,
  EventEmitter
} from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

import WKT from 'ol/format/WKT.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer, XYZ } from 'ol/source';

import { SentinelGranule, MapViewType } from '../models/';
import { MapService } from '../services';


@Component({
  selector: 'app-map',
  template: `
    <div id="map" class="map"></div>

    <app-view-selector
      (newProjection)="onNewProjection($event)">
    </app-view-selector>
  `,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<SentinelGranule[]>;
  @Input() view$: Observable<MapViewType>;

  @Output() newMapView = new EventEmitter<MapViewType>();

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.view$.pipe(
      map(view => this.setMapWith(view)),
      switchMap(newMap =>
        this.granulePolygonsLayer(this.mapService.epsg())
      ),
    ).subscribe(
      layer => this.mapService.addLayer(layer)
    ) ;

  }

  public onNewProjection(view: MapViewType): void {
    this.newMapView.emit(view);
  }

  private setMapWith(view: MapViewType): void {
    switch (view) {
      case MapViewType.ARCTIC: {
        this.mapService.arctic();
        break;
      }
      case MapViewType.EQUITORIAL: {
        this.mapService.equatorial();
        break;
      }
      case MapViewType.ANTARCTIC: {
        this.mapService.antarctic();
        break;
      }
    }
  }

  private granulePolygonsLayer(projection: string): Observable<VectorSource> {
    const wktFormat = new WKT();
    const granuleProjection = 'EPSG:4326';

    return this.granules$.pipe(
      filter(granules => granules.length > 0),
      map(granules => granules
        .map(g => g.wktPoly)
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
