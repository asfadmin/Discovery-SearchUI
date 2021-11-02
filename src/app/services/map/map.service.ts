import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { map, sampleTime } from 'rxjs/operators';

import { Feature, Map } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import * as proj from 'ol/proj';
import Point from 'ol/geom/Point';

import { click, pointerMove } from 'ol/events/condition';
import Select from 'ol/interaction/Select';

import { WktService } from '../wkt.service';
import { DrawService } from './draw.service';
import { LegacyAreaFormatService } from '../legacy-area-format.service';
import * as models from '@models';
import * as sceneStore from '@store/scenes';

import * as polygonStyle from './polygon.style';
import * as views from './views';
import { SarviewsEvent } from '@models';
import { EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { Icon, Style } from 'ol/style';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { Coordinate } from 'ol/coordinate';
import WKT from 'ol/format/WKT';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public isDrawing$ = this.drawService.isDrawing$;

  private mapView: views.MapView;
  private map: Map;
  private polygonLayer: VectorLayer;
  private sarviewsEventsLayer: VectorLayer;
  private browseImageLayer: ImageLayer;
  private gridLinesVisible: boolean;
  private sarviewsFeaturesByID: {[id: string]: Feature} = {};

  private selectClick = new Select({
    condition: click,
    style: polygonStyle.hidden,
    layers: l => l.get('selectable') || false
  });

  private selectHover = new Select({
    condition: pointerMove,
    style: polygonStyle.hover,
    layers: l => l.get('selectable') || false
  });

  private selectSarviewEventHover = new Select({
    condition: pointerMove,
    style: null,
    layers: l => l === this.sarviewsEventsLayer || false
  });

  private selectedSource = new VectorSource({
    wrapX: models.mapOptions.wrapX
  });

  private selectedLayer = new VectorLayer({
    source: this.selectedSource,
    style: polygonStyle.invalid
  });

  private focusSource = new VectorSource({
    wrapX: models.mapOptions.wrapX
  });

  private focusLayer = new VectorLayer({
    source: this.focusSource,
    style: polygonStyle.hover
  });

  private mousePositionSubject$ = new BehaviorSubject<models.LonLat>({
    lon: 0, lat: 0
  });

  public zoom$ = new Subject<number>();
  public center$ = new Subject<models.LonLat>();
  public epsg$ = new Subject<string>();

  public selectedSarviewEvent$: EventEmitter<string> = new EventEmitter();
  public mapInit$: EventEmitter<Map> = new EventEmitter();

  public mousePosition$ = this.mousePositionSubject$.pipe(
    sampleTime(100)
  );

  public newSelectedScene$ = new Subject<string>();

  public searchPolygon$ = this.drawService.polygon$.pipe(
    map(
      feature => feature !== null ?
        this.wktService.featureToWkt(feature, this.epsg()) :
        null
    )
  );

  constructor(
    private wktService: WktService,
    private legacyAreaFormat: LegacyAreaFormatService,
    private drawService: DrawService,
    private store$: Store<AppState>,
  ) {}

  public epsg(): string {
    return this.mapView.projection.epsg;
  }

  public getEventCoordinate(sarviews_id: string): Point {
    return this.sarviewsFeaturesByID[sarviews_id]?.getGeometry() as Point ?? null;
  }

  public zoomIn(): void {
    this.zoom(0.5);
  }

  public zoomOut(): void {
    this.zoom(-0.5);
  }

  public enableInteractions(): void {
    this.selectHover.setActive(true);
    this.selectSarviewEventHover.setActive(true);
    this.selectClick.setActive(true);
  }

  public disableInteractions(): void {
    this.selectHover.setActive(false);
    this.selectSarviewEventHover.setActive(false);
    this.selectClick.setActive(false);
  }

  private zoom(amount: number): void {
    this.map.getView().animate({
      zoom: this.map.getView().getZoom() + amount,
      duration: 150
    });
  }

  public loadPolygonFrom(polygon: string): boolean {
    if (this.legacyAreaFormat.isValid(polygon)) {
      polygon = this.legacyAreaFormat.toWkt(polygon);
    }

    return this.loadWKT(polygon);
  }

  private loadWKT(polygon: string): boolean {
    let didLoad = true;

    try {
      const features = this.wktService.wktToFeature(
        polygon,
        this.epsg()
      );

      this.setDrawFeature(features);
    } catch (e) {
      didLoad = false;
    }

    return didLoad;
  }


  public setLayer(layer: VectorLayer): void {
    if (!!this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer);
    }

    this.polygonLayer = layer;
    this.map.addLayer(this.polygonLayer);
  }

  public setEventsLayer(layer: VectorLayer): void {
      if (!!this.sarviewsEventsLayer) {
        this.map.removeLayer(this.sarviewsEventsLayer);
      }

      this.sarviewsEventsLayer = layer;
      this.map.addLayer(layer);
  }

  public sarviewsEventsToFeatures(events: SarviewsEvent[], projection: string): Feature<Geometry>[] {
    const currentDate = new Date();
    const features = events
      .map(sarviewEvent => {
        const wkt = sarviewEvent.wkt;
        const feature = this.wktService.wktToFeature(wkt, projection);
        feature.set('filename', sarviewEvent.description);

        let point: Point;
        point = new Point([sarviewEvent.point.lat, sarviewEvent.point.lon]);

        feature.set('eventPoint', point);
        feature.setGeometryName('eventPoint');
        feature.set('sarviews_id', sarviewEvent.event_id);

        if (sarviewEvent.event_type !== 'flood') {
          let active = false;
          let iconName = sarviewEvent.event_type === 'quake' ? 'Earthquake_inactive.svg' : 'Volcano_inactive.svg';
          if (!!sarviewEvent.processing_timeframe.end) {
            if (currentDate <= new Date(sarviewEvent.processing_timeframe.end)) {
              active = true;
              iconName = iconName.replace('_inactive', '');
            }
          } else {
            active = true;
            iconName = iconName.replace('_inactive', '');
          }
          const iconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 46],
              anchorXUnits: IconAnchorUnits.FRACTION,
              anchorYUnits: IconAnchorUnits.PIXELS,
              src: `/assets/icons/${iconName}`,
              scale: 0.1,
              offset: [0, 10]
            }),
            zIndex: active ? 1 : 0
          });

          feature.setStyle(iconStyle);
        }

        this.sarviewsFeaturesByID[sarviewEvent.event_id] = feature;

        return feature;
      });
      return features;
  }

  public setOverlayUpdate(updateCallback): void {
    this.drawService.setDrawEndCallback(updateCallback);
  }

  public setDrawStyle(style: models.DrawPolygonStyle): void {
    this.drawService.setDrawStyle(style);
  }

  public setDrawFeature(feature): void {
    this.drawService.setFeature(feature, this.epsg());
  }

  public setInteractionMode(mode: models.MapInteractionModeType) {
    this.drawService.setInteractionMode(this.map, mode);
  }

  public setGridLinesActive(active: boolean) {
    this.gridLinesVisible = active;
    this.map = this.updatedMap();
  }

  public setDrawMode(mode: models.MapDrawModeType): void {
    this.drawService.setDrawMode(this.map, mode);
  }

  public clearDrawLayer(): void {
    this.drawService.clear();
    this.clearFocusedScene();
    this.clearSelectedScene();
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

  public setMapView(viewType: models.MapViewType, layerType: models.MapLayerTypes, overlay): void {
    const view = {
      [models.MapViewType.ANTARCTIC]: views.antarctic(),
      [models.MapViewType.ARCTIC]: views.arctic(),
      [models.MapViewType.EQUITORIAL]: layerType === models.MapLayerTypes.SATELLITE ?
        views.equatorial() :
        views.equatorialStreet(),
    }[viewType];

    this.setMap(view, overlay);
  }

  public clearSelectedScene(): void {
    this.selectedSource.clear();
    this.selectClick.getFeatures().clear();
  }

  public setSelectedFeature(feature): void {
    this.selectedSource.clear();
    this.selectedSource.addFeature(feature);
  }

  public setSelectedPair(features): void {
    this.selectedSource.clear();

    features.forEach(feature =>
      this.selectedSource.addFeature(feature)
    );
  }
  public clearFocusedScene(): void {
    this.focusSource.clear();
    this.selectHover.getFeatures().clear();
  }

  public setFocusedFeature(feature): void {
    this.focusSource.clear();
    this.focusSource.addFeature(feature);
  }

  public zoomToResults(): void {
    const extent = this.polygonLayer
      .getSource()
      .getExtent();

    this.zoomToExtent(extent);
  }

  public zoomToScene(scene: models.CMRProduct): void {
    const feature = this.wktService.wktToFeature(
      scene.metadata.polygon,
      this.epsg()
    );

    this.zoomToFeature(feature);
  }

  public zoomToEvent(targetEvent: models.SarviewsEvent): void {
    const feature = this.wktService.wktToFeature(
      targetEvent.wkt,
      this.epsg()
    );

    this.fixPolygonAntimeridian(feature, targetEvent.wkt);

    this.zoomToFeature(feature);
  }

  public zoomToFeature(feature): void {
    const extent = feature
      .getGeometry()
      .getExtent();

    this.zoomToExtent(extent);
  }

  public onSetSarviewsPolygon(sarviewEvent: SarviewsEvent, radius: number) {
    const wkt = sarviewEvent.wkt;
    const features = this.wktService.wktToFeature(
      wkt,
      this.epsg()
    );

    this.fixPolygonAntimeridian(features, sarviewEvent.wkt);

    features.getGeometry().scale(radius);
    this.setDrawFeature(features);
  }


  public onMapReady(m: Map) {
    this.mapInit$.next(m);
  }


  private zoomToExtent(extent): void {
    this.map
      .getView()
      .fit(extent, {
        size: this.map.getSize(),
        padding: [0, 0, 500, 0],
        duration: 750,
      });
  }

  private setMap(mapView: views.MapView, overlay): void {
    this.mapView = mapView;

    this.map = (!this.map) ?
      this.createNewMap(overlay) :
      this.updatedMap();

    this.map.once('postrender', () => {
      this.onMapReady(this.map);
    });
  }


  private createNewMap(overlay): Map {
    const newMap = new Map({
      layers: [ this.mapView.layer, this.drawService.getLayer(), this.focusLayer, this.selectedLayer, this.mapView?.gridlines ],
      target: 'map',
      view: this.mapView.view,
      controls: [],
      overlays: [overlay]
    });

    newMap.addInteraction(this.selectClick);
    newMap.addInteraction(this.selectHover);
    newMap.addInteraction(this.selectSarviewEventHover);
    this.selectClick.on('select', e => {
      e.target.getFeatures().forEach(
        feature => this.newSelectedScene$.next(feature.get('filename'))
      );
    });

    this.selectHover.on('select', e => {
      this.map.getTargetElement().style.cursor =
        e.selected.length > 0 ? 'pointer' : '';
    });

    this.selectSarviewEventHover.on('select', e => {
      this.map.getTargetElement().style.cursor =
        e.selected.length > 0 ? 'pointer' : '';
    });

    newMap.on('pointermove', e => {
      const [ lon, lat ] = proj.toLonLat(e.coordinate, this.epsg());
      this.mousePositionSubject$.next({ lon, lat });
    });

    newMap.on('singleclick', (evnt) => {
      if (this.map.hasFeatureAtPixel(evnt.pixel)) {
      this.map.forEachFeatureAtPixel(
      evnt.pixel,
      (feature) => {
        const sarview_id: string = feature.get('sarviews_id');
        if (!!sarview_id) {
          this.selectedSarviewEvent$.next(sarview_id);
          this.store$.dispatch(new sceneStore.SetSelectedSarviewsEvent(sarview_id));
        }

        evnt.preventDefault();

        });
      }
    });

    this.drawService.getLayer().setZIndex(100);
    this.focusLayer.setZIndex(99);
    this.selectedLayer.setZIndex(98);

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
    if (this.map.getView().getProjection().getCode() !== this.mapView.projection.epsg) {
      this.map.setView(this.mapView.view);
    }

    const layers = this.map.getLayers().getArray();
    if (this.mapView.projection.epsg === 'EPSG:3857') {
      const gridlineIdx = layers.findIndex(l => l.get('ol_uid') === '100');
      layers[gridlineIdx] = this.mapView.gridlines;
      layers[gridlineIdx]?.setVisible(this.gridLinesVisible);
    } else {
      layers.find(l => l.get('ol_uid') === '100')?.setVisible(false);
    }
    this.mapView.layer.setOpacity(1);

    const mapLayers = this.map.getLayers();
    mapLayers.setAt(0, this.mapView.layer);

    return this.map;
  }

  public setSelectedBrowse(url: string, wkt: string) {
    if(!!this.browseImageLayer) {
      this.map.removeLayer(this.browseImageLayer);
    }
    this.browseImageLayer = this.createImageLayer(url, wkt);
    this.map.addLayer(this.browseImageLayer);
  }

  public createImageLayer(url: string, wkt: string, className: string = 'ol-layer') {
    const format = new WKT();
    const feature = format.readFeature(wkt, {dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'});

    const polygon: Polygon = feature.getGeometry() as Polygon;
    this.fixPolygonAntimeridian(feature, wkt);

    const imagelayer = new ImageLayer({
      source: new Static({
        url,
        imageExtent: polygon.getExtent(),
      }),
      className,
      zIndex: 0,
      extent: polygon.getExtent(),
      opacity: 1.0
    });

    return imagelayer;
  }

  private fixPolygonAntimeridian(feature: Feature<Geometry>, wkt: string) {
    const isMultiPolygon = wkt.includes('MULTIPOLYGON');
    let polygonCoordinates: Coordinate[];
    const geom = feature.getGeometry();
    if (isMultiPolygon) {
      polygonCoordinates = (geom as MultiPolygon).getPolygon(0).getCoordinates()[0];
      (geom as MultiPolygon).setCoordinates([[this.wktService.fixAntimeridianCoordinates(polygonCoordinates)]]);
    } else {
      polygonCoordinates = (geom as Polygon).getCoordinates()[0];
      (geom as Polygon).setCoordinates([this.wktService.fixAntimeridianCoordinates(polygonCoordinates)]);
    }
  }

}
