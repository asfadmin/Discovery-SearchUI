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
  templateUrl: './map.component.html',
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
        this.arctic();
        break;
      }
      case MapView.EQUITORIAL: {
        this.equatorial();
        break;
      }
      case MapView.ANTARCTIC: {
        this.antarctic();
        break;
      }
    }
  }

  private equatorial(): void {
    const projection = 'EPSG:3857';

    const url = this.mapboxUrl();

    this.mapService.setMap(new XYZ({ url }), projection, 3);
  }

  private mapboxUrl(): string {
    const token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const styleUrl = 'williamh890/cjo0daohlaa972smsrpr0ow4d';
    return `https://api.mapbox.com/styles/v1/${styleUrl}/tiles/256/{z}/{x}/{y}?access_token=${token}`;
  }

  private antarctic(): void {
    const projection = 'EPSG:3031';

    const antarcticLayer = new TileWMS({
      url:  'https://mapserver-prod.asf.alaska.edu/wms/amm',
      params: { LAYERS: '8bit', CRS: projection, transparent: true },
      serverType: 'geoserver'
    });

    this.mapService.setMap(antarcticLayer, projection, 2);
  }

  private arctic(): void  {
    const projection = 'EPSG:3572';

    const layer = new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      crossOrigin: '',
      params: {
        'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
        'TILED': true
      },
      projection: 'EPSG:4326'
    });

    this.mapService.setMap(layer, projection, 1);
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
