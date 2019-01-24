import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';

import { Map, View } from 'ol';
import {getCenter} from 'ol/extent.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';

import Draw from 'ol/interaction/Draw.js';
import WKT from 'ol/format/WKT.js';

import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer, XYZ, WMTS } from 'ol/source';

import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';
import proj4 from 'proj4';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import { equatorial, antarctic, arctic, MapView } from './views';
import { LonLat, MapViewType } from '@models';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView: MapView;
  private map: Map;
  private polygonLayer: Layer;

  private drawSource = new VectorSource({ wrapX: false });
  private drawLayer = new VectorLayer({ source: this.drawSource });
  private draw = new Draw({
    source: this.drawSource,
    type: 'Polygon'
  });

  public zoom$ = new Subject<number>();
  public center$ = new Subject<LonLat>();
  public searchPolygon$ = new Subject<string | null>();
  public epsg$ = new Subject<string>();

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

  public addDrawFeature(feature): void {
    this.drawSource.addFeature(feature);
  }

  public clearDrawLayer(): void {
    this.drawSource.clear();
    this.searchPolygon$.next(null);
  }

  public setCenter(centerPos: LonLat): void {
    const { lon, lat } = centerPos;

    this.map.getView().animate({
      center: proj.fromLonLat([lon, lat]),
      duration: 500
    });
  }

  public setZoom(zoom: number): void {
    this.map.getView().animate({
      zoom, duration: 500
    });
  }

  public setMapView(viewType: MapViewType): void {
    const view = {
      [MapViewType.ANTARCTIC]: antarctic(),
      [MapViewType.ARCTIC]: arctic(),
      [MapViewType.EQUITORIAL]: equatorial()
    }[viewType];

    this.setMap(view);
  }

  private setMap(mapView: MapView): void {
    this.mapView = mapView;

    this.map = (!this.map) ?
      this.createNewMap() :
      this.updatedMap();
  }

  private createNewMap(): Map {
    const newMap = new Map({
      layers: [ this.mapView.layer, this.drawLayer ],
      target: 'map',
      view: this.mapView.view,
      controls: [],
      loadTilesWhileAnimating: true
    });

    const format = new WKT();
    const granuleProjection = 'EPSG:4326';

    this.draw.on('drawend', e => {
      const geometry = e.feature.getGeometry();
      const wktString = format.writeGeometry(geometry, {
        dataProjection: granuleProjection,
        featureProjection: this.epsg()
      });

      this.searchPolygon$.next(wktString);
      this.epsg$.next(this.epsg());
    });

    newMap.addInteraction(this.draw);

    newMap.on('moveend', e => {
      const map = e.map;

      const view = map.getView();

      const [lon, lat] = proj.toLonLat(view.getCenter());
      const zoom = view.getZoom();

      this.zoom$.next(zoom);
      this.center$.next({lon, lat});
    });

    return newMap;
  }

  private updatedMap(): Map {
    this.map.setView(this.mapView.view);

    this.mapView.layer.setOpacity(1);

    const mapLayers = this.map.getLayers();

    mapLayers.setAt(0, this.mapView.layer);
    this.clearDrawLayer();

    return this.map;
  }
}
