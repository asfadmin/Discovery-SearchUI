import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { map, sampleTime, tap } from 'rxjs/operators';

import { Collection, Feature, Map, View } from 'ol';
import { Layer, Vector as VectorLayer } from 'ol/layer';
import { TileImage, Vector as VectorSource } from 'ol/source';
import * as proj from 'ol/proj';
import Point from 'ol/geom/Point';
import { OverviewMap, ScaleLine } from 'ol/control';

import { click, pointerMove } from 'ol/events/condition';
import Select from 'ol/interaction/Select';

import { WktService } from '../wkt.service';
import { DrawService } from './draw.service';
import { LayerService } from './layer.service';
import { LegacyAreaFormatService } from '../legacy-area-format.service';
import * as models from '@models';
import * as sceneStore from '@store/scenes';
import { HttpClient } from "@angular/common/http";

import * as polygonStyle from './polygon.style';
import * as views from './views';
import { SarviewsEvent } from '@models';
import { EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style';
import Geometry from 'ol/geom/Geometry';
import LayerGroup from 'ol/layer/Group';
import { PinnedProduct } from '@services/browse-map.service';
import { BrowseOverlayService, PointHistoryService } from '@services';
import { ViewOptions } from 'ol/View';
import { Type as GeometryType } from 'ol/geom/Geometry';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import intersect from '@turf/intersect';
import lineIntersect from '@turf/line-intersect';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import TileLayer from 'ol/layer/WebGLTile.js';

import SimpleGeometry from 'ol/geom/SimpleGeometry';
import { SetGeocode } from '@store/filters';
import { Extent } from 'ol/extent';
import { MultiPolygon } from 'ol/geom';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public isDrawing$ = this.drawService.isDrawing$.pipe(
    tap(isDrawing => this.map.getViewport().style.cursor = isDrawing ? 'crosshair' : 'default')
  );

  private mapView: views.MapView;
  private map: Map;
  private scaleLine: ScaleLine;

  private polygonLayer: VectorLayer<VectorSource>;
  private sarviewsEventsLayer: VectorLayer<VectorSource>;
  private displacmentLayer: VectorLayer<VectorSource>;
  private browseImageLayer: Layer;

  private gridLinesVisible: boolean;
  private sarviewsFeaturesByID: { [id: string]: Feature } = {};
  private pinnedCollection: Collection<Layer> = new Collection<Layer>([], { unique: true });
  private pinnedProducts: LayerGroup = new LayerGroup({ layers: this.pinnedCollection });

  private overviewMap: OverviewMap;

  private localBrowseImageURL: string;

  private selectClick = new Select({
    condition: click,
    style: polygonStyle.hidden,
    layers: l => l.get('selectable')
  });

  private timeseriesClick = new Select({
    condition: click,
    // style: null,
    layers: l => {
      if (l.get('displacement-layer')) {
        return true;
      }
      return false
    }
  });

  private selectHover = new Select({
    condition: pointerMove,
    style: polygonStyle.hover,
    layers: l => l.get('selectable') || false
  });

  private searchPolygonHover = new Select({
    condition: click,
    layers: l => l.get('search_polygon') || false
  });

  private selectSarviewEventHover = new Select({
    condition: pointerMove,
    style: null,
    layers: l => l?.get('selectable_events') || false,
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
  public hasCoherenceLayer$ = new BehaviorSubject<string>(null);

  public selectedSarviewEvent$: EventEmitter<string> = new EventEmitter();
  public mapInit$: EventEmitter<Map> = new EventEmitter();
  public timeseriesPixelSelected$ = new EventEmitter();
  public mousePosition$ = this.mousePositionSubject$.pipe(
    sampleTime(100)
  );

  public newSelectedScene$ = new Subject<string>();
  public newSelectedDisplacement$ = new Subject<Point>();

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
    private browseOverlayService: BrowseOverlayService,
    private layerService: LayerService,
    private http: HttpClient,
    private pointHistoryService: PointHistoryService
  ) { }

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
    this.searchPolygonHover.setActive(true);
    this.timeseriesClick.setActive(true);

  }

  public disableInteractions(): void {
    this.selectHover.setActive(false);
    this.selectSarviewEventHover.setActive(false);
    this.selectClick.setActive(false);
    this.searchPolygonHover.setActive(false);
    this.timeseriesClick.setActive(false);
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
    this.store$.dispatch(new SetGeocode(''));
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


  public setLayer(layer: VectorLayer<VectorSource>): void {
    if (!!this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer);
    }

    this.polygonLayer = layer;
    this.map.addLayer(this.polygonLayer);
  }

  public setEventsLayer(layer: VectorLayer<VectorSource>): void {
    if (!!this.sarviewsEventsLayer) {
      this.map.removeLayer(this.sarviewsEventsLayer);
    }

    this.sarviewsEventsLayer = layer;
    this.map.addLayer(layer);
  }

  public addLayer(layer: Layer) {
    this.map.addLayer(layer)
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
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
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

  public setOverviewMap(open: boolean) {
    this.overviewMap.setCollapsed(!open);
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
      [models.MapViewType.EQUATORIAL]: layerType === models.MapLayerTypes.SATELLITE ?
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
    this.wktService.fixPolygonAntimeridian(feature, targetEvent.wkt);

    this.map.getView().fit(feature.getGeometry().getSimplifiedGeometry(0) as SimpleGeometry, {
      maxZoom: 7,
      size: this.map.getSize(),
      padding: [0, 0, 500, 0],
      duration: 750,
    });
  }

  public zoomToFeature(feature: Feature<Geometry>): void {
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

    this.wktService.fixPolygonAntimeridian(features, sarviewEvent.wkt);

    features.getGeometry().scale(radius);

    if (features.getGeometry().getType() === 'MultiPolygon') {
      features.setGeometry((features.getGeometry() as MultiPolygon).getPolygon(0))
    }
    this.setDrawFeature(features);
  }


  public onMapReady(m: Map) {
    this.mapInit$.next(m);
  }


  public zoomToExtent(extent: Extent): void {
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
    this.overviewMap = new OverviewMap({
      layers: [this.mapView.layer],
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: true,
      className: 'ol-overviewmap ol-custom-overviewmap',
    });
    let test_url: string = `https://api.mapbox.com/v4/asf-discovery.summer-vv/{z}/{x}/{y}.png?access_token=${models.mapboxToken}`
    const test_source = new TileImage({
      'url': test_url,
      wrapX: models.mapOptions.wrapX,
    });

    const test_layer = new TileLayer({ 'source': test_source,
      'extent': [-13384677.834384585, 1442940.3527617827, -6677339.914001508, 3778194.9375690296]
    });

    const newMap = new Map({
      layers: [
        this.mapView.layer,
        this.drawService.getLayer(),
        this.focusLayer,
        this.selectedLayer,
        this.mapView?.gridlines,
        this.pinnedProducts,
        test_layer
      ],
      target: 'map',
      view: this.mapView.view,
      controls: [this.overviewMap],
      overlays: [overlay]
    });

    newMap.addInteraction(this.selectClick);
    newMap.addInteraction(this.timeseriesClick);
    newMap.addInteraction(this.selectHover);
    newMap.addInteraction(this.selectSarviewEventHover);
    this.selectClick.on('select', e => {
      // netcdf-layer
      // if (this.drawService.in)
        this.timeseriesPixelSelected$.emit(null)
      e.target.getFeatures().forEach(
        feature => this.newSelectedScene$.next(feature.get('filename'))
      );
    });
    this.timeseriesClick.on('select', e => {
      e.target.getFeatures().forEach(
        feature => {this.pointHistoryService.passDraw = true; this.newSelectedDisplacement$.next(feature.get('point'))}
      );
    });

    this.selectHover.on('select', e => {
      this.map.getViewport().style.cursor =
        e.selected.length > 0 ? 'pointer' : 'default';
    });

    this.selectSarviewEventHover.on('select', e => {
      this.map.getViewport().style.cursor =
        e.selected.length > 0 ? 'pointer' : 'default';
    });

    newMap.on('pointermove', e => {
      const [lon, lat] = proj.toLonLat(e.coordinate, this.epsg());
      this.mousePositionSubject$.next({ lon, lat });
    });

    newMap.on('movestart', () => {
      newMap.getViewport().style.cursor = 'crosshair';
    });

    newMap.on('moveend', () => {
      newMap.getViewport().style.cursor = 'default';
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
      this.center$.next({ lon, lat });
    });

    return newMap;
  }

  private updatedMap(): Map {
    if (this.map.getView().getProjection().getCode() !== this.mapView.projection.epsg) {
      this.map.setView(this.mapView.view);

      const overviewMapViewOptions = { ...this.mapView.view.getProperties() } as ViewOptions;
      overviewMapViewOptions.center = this.map.getView().getCenter();

      this.overviewMap.getOverviewMap().setView(new View(overviewMapViewOptions));
      this.overviewMap.getOverviewMap().getView().setZoom(3);
      this.overviewMap.getOverviewMap().getLayers().setAt(0, this.mapView.layer);
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

    const controlLayer = new TileLayer({ source: this.mapView.layer.getSource() });
    this.overviewMap.getOverviewMap().getLayers().setAt(0, controlLayer);

    return this.map;
  }

  private trimImage(imageURL) {
    return new Promise((resolve, _reject) => {
      let c = document.createElement('canvas')
      c.width = 5000
      c.height = 5000
      let ctx = c.getContext('2d')

      let base_image = new Image()
      base_image.crossOrigin = 'Anonymous';

      base_image.src = imageURL
      base_image.onload = () => {

        ctx.drawImage(base_image, 0, 0)
        let copy = document.createElement('canvas').getContext('2d'),
          pixels = ctx.getImageData(0, 0, c.width, c.height),
          l = pixels.data.length,
          i,
          bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
          },
          x, y;

        // Iterate over every pixel to find the highest
        // and where it ends on every axis ()
        for (i = 0; i < l; i += 4) {
          if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~((i / 4) / c.width);

            if (bound.top === null) {
              bound.top = y;
            }

            if (bound.left === null) {
              bound.left = x;
            } else if (x < bound.left) {
              bound.left = x;
            }

            if (bound.right === null) {
              bound.right = x;
            } else if (bound.right < x) {
              bound.right = x;
            }

            if (bound.bottom === null) {
              bound.bottom = y;
            } else if (bound.bottom < y) {
              bound.bottom = y;
            }
          }
        }

        // Calculate the height and width of the content
        let trimHeight = bound.bottom - bound.top,
          trimWidth = bound.right - bound.left,
          trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

        copy.canvas.width = trimWidth;
        copy.canvas.height = trimHeight;


        // ctx.globalCompositeOperation = 'multiply';
        copy.putImageData(trimmed, 0, 0);

        // Return trimmed canvas
        copy.canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/png')
      }
    })

  }

  public setSelectedBrowse(url: string, wkt: string) {
    if (!!this.browseImageLayer) {
      this.map.removeLayer(this.browseImageLayer);
    }
    if (!url.endsWith('.tif')) {
      if(url.includes('OPERA')) {
        this.trimImage(url).then((imageBlob: Blob) => {
          let url = URL.createObjectURL(imageBlob);
          URL.revokeObjectURL(this.localBrowseImageURL)
          this.localBrowseImageURL = url;

          this.clearBrowseOverlays();
          this.browseImageLayer = this.browseOverlayService.createImageLayer(url, wkt, 'ol-layer', 'current-overlay');
          this.map.addLayer(this.browseImageLayer);
        })
      } else {
        this.browseImageLayer = this.browseOverlayService.createNormalImageLayer(url, wkt, 'ol-layer', 'current-overlay');
        this.map.addLayer(this.browseImageLayer);
      }
    } else {
      this.http.get(url, {
        withCredentials: true,
        observe: 'response',
        responseType: 'blob'
      }).subscribe((response: any) => {
        this.browseImageLayer = this.browseOverlayService.createGeotiffLayer(response.body, wkt, 'ol-layer', 'current-overlay');
        let s: any = this.browseImageLayer.getSource().getView()!
        s.then((thing: any) => {
          this.map?.getView().fit(thing.extent)
        })
        this.map.addLayer(this.browseImageLayer);
      })
    }
  }

  public setCoherenceLayer(months: string): void {
    if (!!this.layerService.coherenceLayer) {
      this.map.removeLayer(this.layerService.coherenceLayer);
      this.layerService.coherenceLayer = null;
    }


    this.layerService.coherenceLayer = this.layerService.getCoherenceLayer(months);
    this.map.addLayer(this.layerService.coherenceLayer);
    this.hasCoherenceLayer$.next(months);
  }

  public setDisplacementLayer(points: Point[]) {
    if (!!this.displacmentLayer) {
      this.map.removeLayer(this.displacmentLayer);
      this.displacmentLayer = null;
    }

    let source = new VectorSource();
    let pointFeatures = points.map((point: Point) => {
      let temp = point.clone() as Point;
      temp.transform( 'EPSG:4326', 'EPSG:3857')
      let temp_feature = new Feature(temp)
      temp_feature.set('point', point)
      return temp_feature;
    });
    source.addFeatures(pointFeatures);

    this.displacmentLayer = new VectorLayer({
      source: source,
      style: new Style({
        image: new CircleStyle({
          stroke: new Stroke({
            // color: '#000000',
            color: '#ffcc33',
            width: 5,
            lineDash: [3],
            lineDashOffset: 5
          }),
          radius: 7,
          fill: new Fill({
            color: '#236192',
            // color: '#ffcc33',
          }),
        })
      })
    });

    this.displacmentLayer.set('displacement-layer', 'true');

    this.map.addLayer(this.displacmentLayer);
  }

  public clearCoherence(): void {
    if (!this.layerService.coherenceLayer) {
      return;
    }

    this.map.removeLayer(this.layerService.coherenceLayer);
    this.layerService.coherenceLayer = null;
    this.hasCoherenceLayer$.next(null);
  }

  public createBrowseRasterCanvas(scenes: models.CMRProduct[]) {
    const scenesWithBrowse = scenes.filter(scene => scene.browses?.length > 0).slice(0, 10);

    const collection = scenesWithBrowse.reduce((prev, curr) =>
      prev.concat(this.browseOverlayService.createNormalImageLayer(curr.browses[0], curr.metadata.polygon)), [] as Layer[]);

    collection.forEach(element => {
      this.map.addLayer(element);
    });
  }

  public setPinnedProducts(pinnedProductStates: { [product_id in string]: PinnedProduct }) {
    this.browseOverlayService.setPinnedProducts(pinnedProductStates, this.pinnedProducts);
  }

  public clearBrowseOverlays() {
    this.pinnedProducts.getLayers().clear();
    if (!!this.browseImageLayer) {
      this.map.removeLayer(this.browseImageLayer);
    }
  }

  public updateBrowseOpacity(opacity: number) {
    this.browseImageLayer?.setOpacity(opacity);
    this.pinnedProducts?.setOpacity(opacity);
  }
  public updateCoherenceOpacity(opacity: number) {
    this.layerService.coherenceLayer?.setOpacity(opacity);
  }
  public getAoiIntersectionMethod(geometryType: GeometryType) {
    if (geometryType === 'Point') {
      return this.getPointIntersection;
    } else if (geometryType === 'LineString') {
      return this.getLineIntersection;
    }

    return this.getPolygonIntersection;
  }

  public addScaleLine(latlonElement) {
    this.scaleLine = new ScaleLine({
      target: latlonElement,
      className: 'ol-custom-scale-line',
      units: 'metric'
    });
    this.map.addControl(this.scaleLine);
  }

  private getPointIntersection(aoi: Feature<Geometry>, polygon: Feature<Geometry>): boolean {
    const point = aoi.getGeometry() as Point;

    return booleanPointInPolygon(
      point.getCoordinates(),
      {
        'type': 'Polygon',
        'coordinates': [
          (polygon.getGeometry() as Polygon).getCoordinates()[0]
        ],
      });
  }

  private getLineIntersection(aoi: Feature<Geometry>, polygon: Feature<Geometry>): boolean {
    const line = aoi.getGeometry() as LineString;
    return lineIntersect({
      'type': 'LineString',
      'coordinates': [
        ...line.getCoordinates()
      ]
    },
      {
        'type': 'Polygon',
        'coordinates': [
          (polygon.getGeometry() as Polygon).getCoordinates()[0]
        ],
      }).features.length > 0;
  }

  private getPolygonIntersection(aoi: Feature<Geometry>, polygon: Feature<Geometry>): boolean {
    return !!intersect(
      {
        'type': 'Polygon',
        'coordinates': [
          (aoi.getGeometry() as Polygon).getCoordinates()[0]
        ],
      },
      {
        'type': 'Polygon',
        'coordinates': [
          (polygon.getGeometry() as Polygon).getCoordinates()[0]
        ],
      }
    );
  }

}
