import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Map } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, Layer } from 'ol/source';
import * as proj from 'ol/proj';

import { WktService } from '../wkt.service';
import { DrawService } from './draw.service';
import * as models from '@models';

import * as polygonStyle from './polygon.style';
import * as views from './views';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView: views.MapView;
  private viewType: models.MapViewType;
  private map: Map;
  private polygonLayer: Layer;

  private focusSource = new VectorSource({
    noWrap: true, wrapX: false
  });

  private focusLayer = new VectorLayer({
    source: this.focusSource,
    style: polygonStyle.invalid
  });

  public zoom$ = new Subject<number>();
  public center$ = new Subject<models.LonLat>();
  public epsg$ = new Subject<string>();
  public mousePosition$ = new BehaviorSubject<models.LonLat>({
    lon: 0, lat: 0
  });

  public searchPolygon$ = this.drawService.polygon$.pipe(
    map(
      feature => feature !== null ?
        this.wktService.featureToWkt(feature, this.epsg()) :
        null
    )
  );

  constructor(
    private wktService: WktService,
    private drawService: DrawService,
  ) {}

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

  public setDrawStyle(style: models.DrawPolygonStyle): void {
    this.drawService.setDrawStyle(style);
  }

  public setDrawFeature(feature): void {
    this.drawService.setFeature(feature, this.epsg());
  }

  public setInteractionMode(mode: models.MapInteractionModeType) {
    this.drawService.setInteractionMode(map, mode);
  }

  public setDrawMode(mode: models.MapDrawModeType): void {
    this.drawService.setDrawMode(map, mode);
  }

  public clearDrawLayer(): void {
    this.drawService.clear();
  }


  public setCenter(centerPos: models.LonLat): void {
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

  public setMapView(viewType: models.MapViewType): void {
    this.viewType = viewType;

    const view = {
      [models.MapViewType.ANTARCTIC]: views.antarctic(),
      [models.MapViewType.ARCTIC]: views.arctic(),
      [models.MapViewType.EQUITORIAL]: views.equatorial()
    }[viewType];

    this.setMap(view);
  }

  public clearFocusedGranule(): void {
    this.focusSource.clear();
  }

  public setFocusedFeature(feature): void {
    this.focusSource.clear();
    this.focusSource.addFeature(feature);
  }

  private setMap(mapView: views.MapView): void {
    this.mapView = mapView;

    this.map = (!this.map) ?
      this.createNewMap() :
      this.updatedMap();
  }

  private createNewMap(): Map {
    const newMap = new Map({
      layers: [ this.mapView.layer, this.drawService.getLayer(), this.focusLayer ],
      target: 'map',
      view: this.mapView.view,
      controls: [],
      loadTilesWhileAnimating: true
    });

    newMap.on('pointermove', e => {
      const [ lon, lat ] = proj.toLonLat(e.coordinate, this.epsg());
      this.mousePosition$.next({ lon, lat });
    });

    this.drawService.getLayer().setZIndex(100);
    this.focusLayer.setZIndex(99);

    newMap.on('moveend', e => {
      const currentMap = e.map;

      const view = currentMap.getView();

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

    return this.map;
  }
}
