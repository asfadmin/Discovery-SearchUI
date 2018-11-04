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

  public setMap(layer: Layer, projectionEPSG: string, zoom: number, newExtent?: number[]): void {
    this.projection = projectionEPSG;

    this.map = (!this.map) ?
      this.newMap(layer, projectionEPSG, zoom, newExtent) :
      this.updatedExistingMap(layer, projectionEPSG, zoom);
  }

  private newMap(layer: Layer, projectionEPSG: string, zoom: number, newExtent?: number[]): Map {
    const m = new Map({
      layers: [
        new TileLayer({ source: layer })
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        projection: projectionEPSG,
        zoom,
        minZoom: zoom,
        extent: this.transform([-360, -90, 360, 90])
      }),
      controls: [],
    });

    console.log(m.getView().calculateExtent(m.getSize()));

    return m;
  }

  private transform(extent) {
    return proj.transformExtent(extent, 'EPSG:4326', this.projection);
  }

  private updatedExistingMap(source: Layer, projectionEPSG: string, zoom: number) {
    const newView = new View({
      projection: projectionEPSG,
      center: [0, 0],
      minZoom: zoom,
      zoom,
    });
    this.map.setView(newView);

    const layer = new TileLayer({ source });
    layer.setOpacity(1);
    this.map.getLayers().setAt(0, layer);

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
