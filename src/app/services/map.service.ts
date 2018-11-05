import { Injectable } from '@angular/core';

import { Map, View } from 'ol';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import WKT from 'ol/format/WKT.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer, XYZ, WMTS } from 'ol/source';
import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';

import proj4 from 'proj4';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private projection: string;
  private map: Map;

  constructor() {
    this.registerCustomProjections();
  }

  public getProj(): string {
    return this.projection;
  }

  public addLayer(layer: Layer): void {
    this.map.addLayer(layer);
  }

  public equatorial(): void {
    this.projection = 'EPSG:3857';

    const token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const styleUrl = 'williamh890/cjo0daohlaa972smsrpr0ow4d';
    const url = `https://api.mapbox.com/styles/v1/${styleUrl}/tiles/256/{z}/{x}/{y}?access_token=${token}`;

    const source = new XYZ({ url });

    const view = new View({
      center: [0, 0],
      projection: this.projection,
      zoom: 3,
      minZoom: 3,
      extent: this.transform([-320, -90, 320, 90])
    });

    this.setMap(view, new TileLayer({ source }));
  }

  public antarctic(): void {
    this.projection = 'EPSG:3031';

    const source = new WMTS({
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3031/best/wmts.cgi?TIME=2018-02-28',
      layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      format: 'image/jpeg',
      matrixSet: 'EPSG3031_250m',

      tileGrid: new WMTSTileGrid({
        origin: [-4194304, 4194304],
        resolutions: [
          8192.0,
          4096.0,
          2048.0,
          1024.0,
          512.0,
          256.0
        ],
        matrixIds: [0, 1, 2, 3, 4, 5],
        tileSize: 512
      })
    });

    const layer = new TileLayer({
      source,
      extent: [-4194304, -4194304, 4194304, 4194304]
    });

    const view = new View({
      maxResolution: 8192.0,
      projection: proj.get('EPSG:3031'),
      extent: [-4194304, -4194304, 4194304, 4194304],
      center: proj.transform([0, -90], 'EPSG:4326', 'EPSG:3031'),
      zoom: 0,
      maxZoom: 5
    });

    this.setMap(view, layer);
  }

  public arctic(): void  {
    this.projection = 'EPSG:3413';

    const view = new View({
      maxResolution: 8192.0,
      projection: proj.get('EPSG:3413'),
      extent: [-4194304, -4194304, 4194304, 4194304],
      center: [0, 0],
      zoom: 1,
      maxZoom: 5
    });

    const source = new WMTS({
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3413/best/wmts.cgi?TIME=2018-06-31',
      layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      format: 'image/jpeg',
      matrixSet: 'EPSG3413_250m',

      tileGrid: new WMTSTileGrid({
        origin: [-4194304, 4194304],
        resolutions: [
          8192.0,
          4096.0,
          2048.0,
          1024.0,
          512.0,
          256.0
        ],
        matrixIds: [0, 1, 2, 3, 4, 5],
        tileSize: 512
      })
    });

    const layer = new TileLayer({
      source: source,
      extent: [-4194304, -4194304, 4194304, 4194304]
    });

    this.setMap(view, layer);
  }

  private setMap(view: View, baseLayer: TileLayer): void {
    this.map = (!this.map) ?
    this.newMap(view, baseLayer) :
    this.updatedExistingMap(view, baseLayer);
  }

  private newMap(view: View, baseLayer: TileLayer): Map {
    const m = new Map({
      layers: [
        baseLayer
      ],
      target: 'map',
      view,
      controls: [],
    });

    return m;
  }

  private transform(extent) {
    return proj.transformExtent(extent, 'EPSG:4326', this.projection);
  }

  private updatedExistingMap(view: View, baseLayer: TileLayer ): Map {
    this.map.setView(view);

    baseLayer.setOpacity(1);
    this.map.getLayers().setAt(0, baseLayer);

    return this.map;
  }

  private registerCustomProjections(): void {
    proj4.defs('EPSG:3413',
      '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 ' +
      '+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs('EPSG:3413',
      '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 ' +
      '+datum=WGS84 +units=m +no_defs'
    );

    proj4.defs(
      'EPSG:3572',
      '+title=Alaska Albers +proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0' +
      ' +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs('EPSG:3031',
      '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 ' +
      '+datum=WGS84 +units=m +no_defs');
    customProj4.register(proj4);

    proj.get('EPSG:3031').setExtent([-4194304, -4194304, 4194304, 4194304]);
    proj.get('EPSG:3413').setExtent([-4194304, -4194304, 4194304, 4194304]);
  }
}
