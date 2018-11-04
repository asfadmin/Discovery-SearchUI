import { Injectable } from '@angular/core';

import { Map, View } from 'ol';
import WKT from 'ol/format/WKT.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer, XYZ } from 'ol/source';
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

    const layer = new XYZ({ url });

    const view = new View({
        center: [0, 0],
        projection: this.projection,
        zoom: 3,
        minZoom: 3,
        extent: this.transform([-320, -90, 320, 90])
    });

    this.setMap(view, layer);
  }

  public antarctic(): void {
    this.projection = 'EPSG:3031';

    const layer = new TileWMS({
      url:  'https://mapserver-prod.asf.alaska.edu/wms/amm',
      params: { LAYERS: '8bit', CRS: this.projection, transparent: true },
      serverType: 'geoserver'
    });

    const view = new View({
        center: [0, 0],
        projection: this.projection,
        zoom: 2,
        minZoom: 2,
        extent: this.transform([-360, -90, 360, 90])
      });

    this.setMap(view, layer);
  }

  public arctic(): void  {
    this.projection = 'EPSG:3572';

    const layer = new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      crossOrigin: '',
      params: {
        'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
        'TILED': true
      },
      projection: 'EPSG:4326'
    });

    const view = new View({
        center: [0, 0],
        projection: this.projection,
        zoom: 2,
        minZoom: 2,
        extent: this.transform([-360, -90, 360, 90])
      });

    this.setMap(view, layer);
  }

  private setMap(view: View, layer: Layer): void {
    const baseLayer = new TileLayer({ source: layer });

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
    proj4.defs('EPSG:3413', '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 ' +
          '+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
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
