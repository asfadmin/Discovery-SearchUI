import { Injectable } from '@angular/core';

import { Map, View } from 'ol';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import WKT from 'ol/format/WKT.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer, XYZ, WMTS } from 'ol/source';
import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';

import proj4 from 'proj4';

import { equatorial, antarctic, arctic, MapView } from './views';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView: MapView;
  private map: Map;
  private polygonLayer: Layer;

  public epsg(): string {
    return this.mapView.projection.epsg;
  }

  public setLayer(layer: Layer): void {
    if (!!this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer);
    }

    this.polygonLayer = layer;
    this.map.addLayer(this.polygonLayer);
  }

  public equatorial() {
    this.setMap(equatorial());
  }

  public antarctic(): void {
    this.setMap(antarctic());
  }

  public arctic(): void  {
    this.setMap(arctic());
  }

  private setMap(mapView: MapView): void {
    this.mapView = mapView;

    if (!this.map) {
      this.map = this.newMap();
    } else {
      this.map = this.updatedMap();
    }
  }

  private newMap(): Map {
    return new Map({
      layers: [ this.mapView.layer ],
      target: 'map',
      view: this.mapView.view,
      controls: [],
    });
  }

  private updatedMap(): Map {
    this.map.setView(this.mapView.view);

    this.mapView.layer.setOpacity(1);
    this.map.getLayers().setAt(0, this.mapView.layer);

    return this.map;
  }
}
