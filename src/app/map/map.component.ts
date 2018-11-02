import {
  Component, OnInit,
  Input, Output,
  EventEmitter
} from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

import { Map, View } from 'ol';
import WKT from 'ol/format/WKT.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer, XYZ } from 'ol/source';
import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';

import proj4 from 'proj4';

import { SentinelGranule, MapView } from '../models/';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<SentinelGranule[]>;
  @Input() view$: Observable<MapView>;

  @Output() newMapView = new EventEmitter<MapView>();

  private projection: string;
  private map: Map;

  ngOnInit() {
    this.registerCustomProjections();

    this.equatorial();

    this.view$.pipe(
      map(view => this.setMapWith(view)),
      switchMap(newMap =>
        this.granulePolygonsLayer(this.projection)
      ),
    ).subscribe(
      layer => this.map.addLayer(layer)
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
    this.projection = 'EPSG:3857';
    const token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const url = `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${token}`;
    this.map = this.setMap(new XYZ({ url }), this.projection, 0);
  }

  private antarctic(): void {
    this.projection = 'EPSG:3031';

    const antarcticLayer = new TileWMS({
      url:  'https://mapserver-prod.asf.alaska.edu/wms/amm',
      params: { LAYERS: '8bit', CRS: this.projection, transparent: true },
      serverType: 'geoserver'
    });

    this.map = this.setMap(antarcticLayer, this.projection, 2);
  }

  private arctic(): void  {
    this.projection = 'EPSG:3572';
    const layer = new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      crossOrigin: '',
      params: {
        'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
        'TILED': true
      },
      projection: 'EPSG:4326'
    })
    this.map = this.setMap(layer, this.projection, 1);
  }

  private setMap(layer: Layer, projectionEPSG: string, zoom: number): Map {
    return (!this.map) ?
      this.newMap(layer, projectionEPSG, zoom) :
      this.updatedExistingMap(layer, projectionEPSG, zoom);
  }

  private newMap(layer: Layer, projectionEPSG: string, zoom: number): Map {
    return new Map({
      layers: [
        new TileLayer({ source: layer })
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        projection: proj.get(projectionEPSG),
        maxResolution: 25000,
        zoom
      }),
      controls: [],
    });
  }

  private updatedExistingMap(source: Layer, projectionEPSG: string, zoom: number) {
    const newView = new View({
      projection: proj.get(projectionEPSG),
      center: [0, 0],
      maxResolution: 25000,
      zoom
    });
    this.map.setView(newView);

    const layer = new TileLayer({ source });
    layer.setOpacity(1);
    this.map.getLayers().setAt(0, layer);

    return this.map;
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

  private registerCustomProjections(): void {
    proj4.defs(
      'EPSG:3413',
      '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 ' +
      '+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs(
      'EPSG:3572',
      '+title=Alaska Albers +proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0' +
      ' +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs(
      'EPSG:3031',
      '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 ' +
      '+ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    customProj4.register(proj4);
  }
}
