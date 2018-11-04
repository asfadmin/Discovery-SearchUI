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

import { SentinelGranule, MapView } from '../models/';
import { MapService } from '../services';


@Component({
  selector: 'app-map',
  template: `
    <div id="map" class="map"></div>

    <app-projection-selection
        (newProjection)="onNewProjection($event)">
    </app-projection-selection>
  `,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<SentinelGranule[]>;
  @Input() view$: Observable<MapView>;

  @Output() newMapView = new EventEmitter<MapView>();

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.view$.pipe(
      map(view => this.setMapWith(view)),
      switchMap(newMap =>
        this.granulePolygonsLayer(this.mapService.getProj())
      ),
    ).subscribe(
      layer => this.mapService.addLayer(layer)
    ) ;

  }

  public onNewProjection(view: MapView): void {
    this.newMapView.emit(view);
  }

  private setMapWith(view: MapView): void {
    switch (view) {
      case MapView.ARCTIC: {
        this.mapService.arctic();
        break;
      }
      case MapView.EQUITORIAL: {
        this.mapService.equatorial();
        break;
      }
      case MapView.ANTARCTIC: {
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
