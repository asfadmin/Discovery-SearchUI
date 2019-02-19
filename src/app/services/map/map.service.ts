import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { Map } from 'ol';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { createBox } from 'ol/interaction/Draw.js';
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

  private modify: Modify;
  private snap: Snap;

  public zoom$ = new Subject<number>();
  public center$ = new Subject<models.LonLat>();
  public searchPolygon$ = new Subject<string | null>();
  public epsg$ = new Subject<string>();
  public mousePosition$ = new BehaviorSubject<models.LonLat>({
    lon: 0, lat: 0
  });

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

  public setPolygonError(): void {
    this.drawService.getLayer().setStyle(polygonStyle.invalid);
  }

  public setGoodPolygon(): void {
    this.drawService.setGoodStyle();
  }

  public setValidPolygon(): void {
    this.drawService.setValidStyle();
  }

  public setOmittedPolygon(): void {
    this.drawService.setOmittedStyle();
  }

  public setDrawFeature(feature): void {
    this.drawService.setFeature(feature);

    this.searchPolygon$.next(
      this.wktService.featureToWkt(feature, this.epsg())
    );
  }

  public setInteractionMode(mode: models.MapInteractionModeType) {
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.snap);
    this.map.removeInteraction(this.drawService.getInteraction());

    if (mode === models.MapInteractionModeType.DRAW) {
      this.map.addInteraction(this.drawService.getInteraction());
    } else if (mode === models.MapInteractionModeType.EDIT) {
      this.map.addInteraction(this.snap);
      this.map.addInteraction(this.modify);
    }
  }

  public setDrawMode(mode: models.MapDrawModeType): void {
    this.map.removeInteraction(this.drawService.getInteraction());

    this.drawService.setInteraction(this.createDraw(mode));
    this.map.addInteraction(this.drawService.getInteraction());
  }

  public clearDrawLayer(): void {
    this.drawService.clear();
    this.searchPolygon$.next(null);
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

    this.modify = new Modify({ source: this.drawService.getSource() });
    this.modify.on('modifyend', e => {
      const feature = e.features.getArray()[0];
      this.setValidPolygon();
      this.setSearchPolygon(feature);
    });

    this.drawService.getLayer().setZIndex(100);
    this.focusLayer.setZIndex(99);

    this.snap = new Snap({source: this.drawService.getSource()});

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

  public createDraw(drawMode: models.MapDrawModeType) {
    let draw: Draw;

    if (drawMode === models.MapDrawModeType.BOX) {
      draw = new Draw({
        source: this.drawService.getSource(),
        type: 'Circle', // Actually a box...
        geometryFunction: createBox()
      });
    } else {
      draw = new Draw({
        source: this.drawService.getSource(),
        type: drawMode
      });
    }

    draw.on('drawstart', e => this.clearDrawLayer());
    draw.on('drawend', e => this.setSearchPolygon(e.feature));

    return draw;
  }

  private setSearchPolygon = feature => {
    const wktPolygon = this.wktService.featureToWkt(feature, this.epsg());

    this.searchPolygon$.next(wktPolygon);
    this.epsg$.next(this.epsg());
  }

  private updatedMap(): Map {
    this.map.setView(this.mapView.view);

    this.mapView.layer.setOpacity(1);
    const mapLayers = this.map.getLayers();
    mapLayers.setAt(0, this.mapView.layer);

    return this.map;
  }
}
