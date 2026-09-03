import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import intersect from '@turf/intersect';
import lineIntersect from '@turf/line-intersect';
import { Collection, Feature, Map, Overlay, View } from 'ol';
import { OverviewMap, ScaleLine } from 'ol/control';
import { click, pointerMove } from 'ol/events/condition';
import { Extent, isEmpty } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON.js';
import Geometry, { Type as GeometryType } from 'ol/geom/Geometry';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { Layer, Vector as VectorLayer } from 'ol/layer';
import LayerGroup from 'ol/layer/Group';
import VectorImageLayer from 'ol/layer/VectorImage';
import TileLayer from 'ol/layer/WebGLTile.js';
import * as proj from 'ol/proj';
import { Vector as VectorSource, XYZ } from 'ol/source';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text as olText,
} from 'ol/style';
import { ViewOptions } from 'ol/View';
import { BehaviorSubject, Subject } from 'rxjs';
import { first, map, sampleTime, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import * as models from '@models';
import { BrowseOverlayService, PointHistoryService } from '@services';
import { AppState } from '@store';
import { SetGeocode } from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import { WktService } from '../wkt.service';
import { DrawService } from './draw.service';
import { LayerService } from './layer.service';
import { LegacyAreaFormatService } from '../legacy-area-format.service';
import * as polygonStyle from './polygon.style';
// import * as tileStyle from 'ol/style'
import * as views from './views';

@Injectable({
  providedIn: 'root',
})
export class MapService implements OnDestroy {
  private wktService = inject(WktService);
  private legacyAreaFormat = inject(LegacyAreaFormatService);
  private drawService = inject(DrawService);
  private store$ = inject<Store<AppState>>(Store);
  private browseOverlayService = inject(BrowseOverlayService);
  private layerService = inject(LayerService);
  private http = inject(HttpClient);
  private pointHistoryService = inject(PointHistoryService);

  public isDrawing$ = this.drawService.isDrawing$.pipe(
    tap(
      (isDrawing) =>
        (this.map.getViewport().style.cursor = isDrawing
          ? 'crosshair'
          : 'default'),
    ),
  );
  public focusedAriaFrame$ = new Subject<Feature>();
  private subs = new SubSink();
  private mapView: views.MapView;
  private map: Map;
  private scaleLine: ScaleLine;

  private polygonLayer: VectorLayer<VectorSource>;
  public displacmentLayer: VectorLayer<VectorSource>;
  public frameSelectionOverlay = new VectorImageLayer<VectorSource>();
  public selectedOnDemandFrameOverlays = new VectorLayer<VectorSource>({
    style: new Style({
      zIndex: 100000,
      stroke: new Stroke({
        color: '#ff5555',
        width: 6,
      }),
    }),
  });
  private browseImageLayer: Layer;

  private gridLinesVisible: boolean;
  private pinnedCollection: Collection<Layer> = new Collection<Layer>([], {
    unique: true,
  });
  private pinnedProducts: LayerGroup = new LayerGroup({
    layers: this.pinnedCollection,
  });

  private overviewMap: OverviewMap;

  private localBrowseImageURL: string;

  private displacementOverview: TileLayer = new TileLayer({});
  public displacementOverview$ =
    new BehaviorSubject<models.DisplacementLayerTypes | null>(null);
  private priorityOverview = new VectorLayer<VectorSource>();
  public priorityEnabled$ = new BehaviorSubject<models.FlightDirection | null>(
    null,
  );
  public searchType: models.SearchType;

  public displacementRange: {
    range: number[];
    units: string;
  };

  constructor() {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe((searchType) => {
        this.searchType = searchType;
      }),
    );
  }

  private selectClick = new Select({
    condition: click,
    style: function (feature) {
      if (feature.get('dir')) {
        // only frame overlay has this defined
        return polygonStyle.selected;
      } else {
        return polygonStyle.hidden;
      }
    },
    layers: (l) => l.get('selectable'),
  });

  private timeseriesClick = new Select({
    condition: click,
    style: null,
    layers: (l) => {
      if (l.get('displacement-layer')) {
        return true;
      }
      return false;
    },
  });

  private timeseriesHover = new Select({
    condition: pointerMove,
    style: null,
    layers: (l) => {
      if (l.get('displacement-layer')) {
        return true;
      }
      return false;
    },
  });

  private selectHover = new Select({
    condition: pointerMove,
    style: polygonStyle.hover,
    layers: (l) => l.get('selectable') || false,
  });

  private searchPolygonHover = new Select({
    condition: click,
    layers: (l) => l.get('search_polygon') || false,
  });

  private selectSarviewEventHover = new Select({
    condition: pointerMove,
    style: null,
    layers: (l) => l?.get('selectable_events') || false,
  });

  private selectedSource = new VectorSource({
    wrapX: models.mapOptions.wrapX,
  });

  private selectedLayer = new VectorLayer({
    source: this.selectedSource,
    style: polygonStyle.invalid,
  });

  private focusSource = new VectorSource({
    wrapX: models.mapOptions.wrapX,
  });

  private focusLayer = new VectorLayer({
    source: this.focusSource,
    style: polygonStyle.hover,
  });

  private mousePositionSubject$ = new BehaviorSubject<models.LonLat>({
    lon: 0,
    lat: 0,
  });

  private projectedPosition;

  public zoom$ = new Subject<number>();
  public center$ = new Subject<models.LonLat>();
  public epsg$ = new Subject<string>();
  public hasCoherenceLayer$ = new BehaviorSubject<string>(null);

  public selectedSarviewEvent$ = new EventEmitter<string>();
  public mapInit$ = new EventEmitter<Map>();
  public timeseriesPixelSelected$ = new EventEmitter();
  public mousePosition$ = this.mousePositionSubject$.pipe(sampleTime(100));

  public newSelectedScene$ = new Subject<string>();
  public newSelectedDisplacement$ = new Subject<Point>();

  public searchPolygon$ = this.drawService.polygon$.pipe(
    map((feature) =>
      feature !== null
        ? this.wktService.featureToWkt(feature, this.epsg())
        : null,
    ),
  );

  public epsg(): string {
    return this.mapView.projection.epsg;
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
    this.timeseriesHover.setActive(true);
  }

  public disableInteractions(): void {
    this.selectHover.setActive(false);
    this.selectSarviewEventHover.setActive(false);
    this.selectClick.setActive(false);
    this.searchPolygonHover.setActive(false);
    this.timeseriesClick.setActive(false);
    this.timeseriesHover.setActive(false);
  }

  private zoom(amount: number): void {
    this.map.getView().animate({
      zoom: this.map.getView().getZoom() + amount,
      duration: 150,
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
      const features = this.wktService.wktToFeature(polygon, this.epsg());
      this.setDrawFeature(features);
    } catch (_e) {
      didLoad = false;
    }

    return didLoad;
  }

  public setLayer(layer: VectorLayer<VectorSource>): void {
    let previousVisible = true;
    if (this.polygonLayer) {
      previousVisible = this.polygonLayer.isVisible();
      this.map.removeLayer(this.polygonLayer);
    }

    this.polygonLayer = layer;
    this.polygonLayer.setVisible(previousVisible);
    this.map.addLayer(this.polygonLayer);
  }

  public addLayer(layer: Layer) {
    this.map.addLayer(layer);
  }

  public setOverlayUpdate(updateCallback): void {
    this.drawService.setDrawEndCallback(updateCallback);
  }

  public setDrawStyle(style: models.DrawPolygonStyle): void {
    if (this.searchType == 'Displacement') {
      this.drawService.setDrawStyle(models.DrawPolygonStyle.VALID_DISPLACEMENT);
      this.drawService.getLayer().setVisible(false);
    } else {
      this.drawService.setDrawStyle(style);
      this.drawService.getLayer().setVisible(true);
    }
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

  public setFrameSelectionActive(
    active: boolean,
    url?: string,
    frameRange?: models.Range<number | null>,
    pathRange?: models.Range<number | null>,
  ) {
    if (!active) {
      this.frameSelectionOverlay.setVisible(false);
      this.selectClick?.getFeatures().clear();
      this.polygonLayer?.setVisible(true); // disable the polygons of scenes
      this.browseImageLayer?.setVisible(true);
      this.selectedLayer?.setVisible(true);
      if (this.selectedSource.getFeatures()[0]?.get('dir')) {
        this.selectedSource.clear();
      }
      this.setAriaPopupOverlay(null, null);
      this.selectedOnDemandFrameOverlays?.getSource()?.clear();
      return;
    }

    this.frameSelectionOverlay.setVisible(true);
    const source = new VectorSource({
      url,
      format: new GeoJSON({}),
    });
    this.frameSelectionOverlay.setSource(source);
    this.frameSelectionOverlay.setStyle(function (_feature, _resolution) {
      return new Style({
        fill: new Fill({
          color: '#FFFFFF33',
        }),
        stroke: new Stroke({
          color: 'black',
        }),
      });
    });
    this.frameSelectionOverlay.set('selectable', 'true');
    this.frameSelectionOverlay.set('frameOverlay', 'true');

    this.polygonLayer.setVisible(false); // disable the polygons of scenes
    this.browseImageLayer?.setVisible(false);
    this.selectedLayer.setVisible(false);

    source.on('featuresloadend', () => {
      if (this.frameSelectionOverlay.getSourceState() === 'ready') {
        this.filterFrameOverlay(frameRange, pathRange);
      }
    });
  }

  public isWithinRange(value, range: models.Range<number | null>) {
    if (range === null || range == undefined) {
      return true;
    }
    if (range?.start !== null) {
      if (range?.end !== null) {
        return value >= range?.start && value <= range?.end;
      } else {
        return value >= range?.start;
      }
    } else if (range?.end !== null) {
      return value <= range.end;
    }
    return true;
  }
  public filterFrameOverlay(
    frameRange: models.Range<number | null>,
    pathRange: models.Range<number | null>,
  ) {
    this.frameSelectionOverlay
      ?.getSource()
      ?.getFeatures()
      .forEach((a) => {
        const frame = +a.get('id');
        const path = +a.get('path');

        if (
          this.isWithinRange(frame, frameRange) &&
          this.isWithinRange(path, pathRange)
        ) {
          a.setStyle(
            new Style({
              fill: new Fill({
                color: '#FFFFFF33',
              }),
              stroke: new Stroke({
                color: 'black',
              }),
            }),
          );
        } else {
          a.setStyle(new Style({}));
        }
      });
  }

  public setDrawMode(mode: models.MapDrawModeType): void {
    this.drawService.setDrawMode(this.map, mode);
  }

  public clearDrawLayer(): void {
    this.drawService.clear();
    this.clearFocusedScene();
    this.clearSelectedScene();
    // this.frameSelectionOverlay.setSource(null);
  }

  public setOverviewMap(open: boolean) {
    this.overviewMap.setCollapsed(!open);
  }

  public setCenter(centerPos: models.LonLat): void {
    const { lon, lat } = centerPos;

    this.map.getView().animate({
      center: proj.fromLonLat([lon, lat]),
      duration: 500,
    });
  }

  public setZoom(zoom: number): void {
    this.map.getView().animate({
      zoom,
      duration: 500,
    });
  }

  public setMapView(
    viewType: models.MapViewType,
    layerType: models.MapLayerTypes,
    overlay,
  ): void {
    const view = {
      [models.MapViewType.ANTARCTIC]: views.antarctic(),
      [models.MapViewType.ARCTIC]: views.arctic(),
      [models.MapViewType.EQUATORIAL]:
        layerType === models.MapLayerTypes.SATELLITE
          ? views.equatorial()
          : views.equatorialStreet(),
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

    features.forEach((feature) => this.selectedSource.addFeature(feature));
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
    const extent = this.polygonLayer.getSource().getExtent();

    if (!isEmpty(extent)) {
      this.zoomToExtent(extent);
    }
  }

  public zoomToScene(scene: models.CMRProduct): void {
    const feature = this.wktService.wktToFeature(
      scene.metadata.polygon,
      this.epsg(),
    );

    this.zoomToFeature(feature);
  }

  public zoomToFeature(feature: Feature<Geometry>): void {
    const extent = feature.getGeometry().getExtent();

    this.zoomToExtent(extent);
  }

  public onMapReady(m: Map) {
    this.mapInit$.next(m);
  }

  public zoomToExtent(extent: Extent): void {
    this.map.getView().fit(extent, {
      size: this.map.getSize(),
      padding: [0, 0, 500, 0],
      duration: 750,
    });
  }

  public setAriaPopupOverlay(container: HTMLElement, _lonLat) {
    if (container) {
      const OnDemandMapPopupMenuOverlay = new Overlay({
        element: container,
        position: this.projectedPosition,
        id: 'customOnDemandMenu',
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      this.map.addOverlay(OnDemandMapPopupMenuOverlay);
    } else {
      this.map.removeOverlay(this.map.getOverlayById('customOnDemandMenu'));
      // this.map.addLayer(this.selectedOnDemandFrameOverlays)
    }
  }
  public sbasFrameMode(
    enabled: boolean,
    frame: string,
    dataset: models.Dataset,
  ) {
    this.polygonLayer.setVisible(enabled);
    this.selectedLayer.setVisible(enabled);
    if (!enabled) {
      this.setFrameSelectionActive(true, dataset?.frameMap?.ascending, {
        start: +frame,
        end: +frame,
      });
    } else {
      this.setFrameSelectionActive(false);
    }
  }

  private setMap(mapView: views.MapView, overlay): void {
    this.mapView = mapView;

    this.map = !this.map ? this.createNewMap(overlay) : this.updatedMap();

    this.map.once('postrender', () => {
      this.onMapReady(this.map);
    });
  }
  private handleSelect(e: SelectEvent) {
    // only do this for the frame selector
    if (e.target.getFeatures().getArray()[0]?.get('dir')) {
      this.selectedSource.clear();
      this.selectedSource.addFeature(e.selected[0]); // handle multiple things here.
      const feat = e.target.getFeatures().getArray()[0];
      // const id = feat.get('id');
      // console.log(`Id selected: ${id}`);
      this.focusedAriaFrame$.next(feat);
    } else {
      e.target
        .getFeatures()
        .forEach((feature) =>
          this.newSelectedScene$.next(feature.get('filename')),
        );
    }
  }

  public setOnDemandSBASFrame(feature: Feature<Geometry>) {
    this.selectedOnDemandFrameOverlays.setSource(
      new VectorSource({
        features: [feature.clone()],
      }),
    );
    // this.frameSelectionOverlay.setStyle(
    //     (feat) => {
    //         if (feat.get('id') === id) {
    //             return new Style( {
    //         zIndex: 100000,
    //           stroke: new Stroke({
    //         color:'green',
    //         width:4,
    //         })})
    //         } else {
    //             return new Style({'stroke': new Stroke({'color': '#00000000'})})
    //         }
    //     }
    // )
  }
  private createNewMap(overlay): Map {
    this.overviewMap = new OverviewMap({
      layers: [this.mapView.layer],
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: true,
      className: 'ol-overviewmap ol-custom-overviewmap',
    });

    const newMap = new Map({
      layers: [
        this.mapView.layer,
        this.drawService.getLayer(),
        this.focusLayer,
        this.selectedLayer,
        this.mapView?.gridlines,
        this.pinnedProducts,
        this.priorityOverview,
        this.displacementOverview,
        this.frameSelectionOverlay,
        this.selectedOnDemandFrameOverlays,
      ],
      target: 'map',
      view: this.mapView.view,
      controls: [this.overviewMap],
      overlays: [overlay],
    });

    newMap.addInteraction(this.selectClick);
    newMap.addInteraction(this.timeseriesClick);
    newMap.addInteraction(this.timeseriesHover);
    newMap.addInteraction(this.selectHover);
    newMap.addInteraction(this.selectSarviewEventHover);
    this.selectClick.on('select', (e) => {
      this.handleSelect(e);
    });

    this.timeseriesClick.on('select', (e) => {
      const selectedPoint = e.selected[0].get('uuid');
      this.store$.dispatch(new uiStore.SetActiveUUID(selectedPoint));
      e.preventDefault();
    });

    this.timeseriesHover.on('select', (e) => {
      const selectedPoint = e.selected[0]?.get('uuid');
      if (!selectedPoint) {
        this.store$.dispatch(new uiStore.SetActiveUUID(null));
        e.preventDefault();
        return;
      }
      this.store$.dispatch(new uiStore.SetActiveUUID(selectedPoint));
      e.preventDefault();
    });

    this.selectHover.on('select', (e) => {
      this.map.getViewport().style.cursor =
        e.selected.length > 0 ? 'pointer' : 'default';
    });

    this.selectSarviewEventHover.on('select', (e) => {
      this.map.getViewport().style.cursor =
        e.selected.length > 0 ? 'pointer' : 'default';
    });

    newMap.on('pointermove', (e) => {
      const [lon, lat] = proj.toLonLat(e.coordinate, this.epsg());
      this.mousePositionSubject$.next({ lon, lat });
      this.projectedPosition = e.coordinate;
    });

    newMap.on('movestart', () => {
      newMap.getViewport().style.cursor = 'crosshair';
    });

    newMap.on('moveend', () => {
      newMap.getViewport().style.cursor = 'default';
    });

    this.drawService.getLayer().setZIndex(100);
    this.focusLayer.setZIndex(99);
    this.selectedLayer.setZIndex(98);

    newMap.on('moveend', (e) => {
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
    if (
      this.map.getView().getProjection().getCode() !==
      this.mapView.projection.epsg
    ) {
      this.map.setView(this.mapView.view);

      const overviewMapViewOptions = {
        ...this.mapView.view.getProperties(),
      } as ViewOptions;
      overviewMapViewOptions.center = this.map.getView().getCenter();

      this.overviewMap
        .getOverviewMap()
        .setView(new View(overviewMapViewOptions));
      this.overviewMap.getOverviewMap().getView().setZoom(3);
      this.overviewMap
        .getOverviewMap()
        .getLayers()
        .setAt(0, this.mapView.layer);
      this.frameSelectionOverlay.getSource()?.refresh();
    }

    const layers = this.map.getLayers().getArray();
    if (this.mapView.projection.epsg === 'EPSG:3857') {
      const gridlineIdx = layers.findIndex((l) => l.get('ol_uid') === '100');
      layers[gridlineIdx] = this.mapView.gridlines;
      layers[gridlineIdx]?.setVisible(this.gridLinesVisible);
    } else {
      layers.find((l) => l.get('ol_uid') === '100')?.setVisible(false);
    }

    this.mapView.layer.setOpacity(1);

    const mapLayers = this.map.getLayers();
    mapLayers.setAt(0, this.mapView.layer);

    const controlLayer = new TileLayer({
      source: this.mapView.layer.getSource(),
    });
    this.overviewMap.getOverviewMap().getLayers().setAt(0, controlLayer);

    return this.map;
  }

  private trimImage(imageURL) {
    return new Promise((resolve, _reject) => {
      const c = document.createElement('canvas');
      c.width = 5000;
      c.height = 5000;
      const ctx = c.getContext('2d');

      const base_image = new Image();
      base_image.crossOrigin = 'Anonymous';
      base_image.src = imageURL;

      base_image.onload = () => {
        ctx.drawImage(base_image, 0, 0);
        const copy = document.createElement('canvas').getContext('2d'),
          pixels = ctx.getImageData(0, 0, c.width, c.height),
          l = pixels.data.length,
          bound = {
            top: null,
            left: null,
            right: null,
            bottom: null,
          };
        let i, x, y;

        // Iterate over every pixel to find the highest
        // and where it ends on every axis ()
        for (i = 0; i < l; i += 4) {
          if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~(i / 4 / c.width);

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
        const trimHeight = bound.bottom - bound.top,
          trimWidth = bound.right - bound.left,
          trimmed = ctx.getImageData(
            bound.left,
            bound.top,
            trimWidth,
            trimHeight,
          );

        copy.canvas.width = trimWidth;
        copy.canvas.height = trimHeight;

        // ctx.globalCompositeOperation = 'multiply';
        copy.putImageData(trimmed, 0, 0);

        // Return trimmed canvas
        copy.canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      };
    });
  }

  public setSelectedBrowse(
    url: string,
    wkt: string,
    scene: models.CMRProduct = null,
  ) {
    this.setLayerText('Approximate Placement Only');
    if (this.browseImageLayer) {
      this.map.removeLayer(this.browseImageLayer);
    }
    if (!url.endsWith('.tif')) {
      if (url.includes('OPERA') || url.includes('NISAR')) {
        this.trimImage(url).then((imageBlob: Blob) => {
          const url = URL.createObjectURL(imageBlob);
          URL.revokeObjectURL(this.localBrowseImageURL);
          this.localBrowseImageURL = url;

          this.clearBrowseOverlays();
          this.browseImageLayer = this.browseOverlayService.createImageLayer(
            url,
            wkt,
            'ol-layer',
            'current-overlay',
          );
          this.map.addLayer(this.browseImageLayer);
        });
      } else {
        if (scene.dataset === 'NISAR') {
          if (
            scene.id.startsWith('NISAR_L1') &&
            url !== '/assets/no-browse.png'
          ) {
            this.setLayerText('Level 2 Equivalent Browse Displayed');
          }
        }
        this.browseImageLayer =
          this.browseOverlayService.createNormalImageLayer(
            url,
            wkt,
            'ol-layer',
            'current-overlay',
          );
        this.map.addLayer(this.browseImageLayer);
      }
    } else {
      this.http
        .get(url, {
          withCredentials: true,
          observe: 'response',
          responseType: 'blob',
        })
        .subscribe((response: any) => {
          this.browseImageLayer = this.browseOverlayService.createGeotiffLayer(
            response.body,
            wkt,
            'ol-layer',
            'current-overlay',
          );
          const s: any = this.browseImageLayer.getSource().getView()!;
          s.then((thing: any) => {
            this.map?.getView().fit(thing.extent);
          });
          this.map.addLayer(this.browseImageLayer);
        });
    }
  }

  public setCoherenceLayer(months: string): void {
    if (this.layerService.coherenceLayer) {
      this.map.removeLayer(this.layerService.coherenceLayer);
      this.layerService.coherenceLayer = null;
    }

    this.layerService.coherenceLayer =
      this.layerService.getCoherenceLayer(months);
    this.map.addLayer(this.layerService.coherenceLayer);
    this.hasCoherenceLayer$.next(months);
  }

  public setDisplacementOverview(
    direction: models.FlightDirection,
    type: models.DisplacementLayerTypes,
  ) {
    const apiDirValues = {
      [models.FlightDirection.ASCENDING]: 'ASC',
      [models.FlightDirection.DESCENDING]: 'DESC',
    };
    const apiDispValues = {
      [models.DisplacementLayerTypes.DISPLACEMENT]: 'DISP',
      [models.DisplacementLayerTypes.VELOCITY]: 'VEL',
    };
    const dir = apiDirValues[direction];
    const layerType = apiDispValues[type];

    const base_url = `https://d3g9emy65n853h.cloudfront.net/main/${dir.toLowerCase()}/${layerType.toLowerCase()}`;
    this.displacementOverview$.next(type);

    this.http
      .get(`${base_url}/extent.json`)
      .pipe(first())
      .subscribe((response: any) => {
        if (this.displacementOverview) {
          this.displacementOverview.setSource(null);
        }

        const overview_source = new XYZ({
          url: `${base_url}/{z}/{x}/{y}.png`,
          wrapX: models.mapOptions.wrapX,
          tileSize: [256, 256],
          maxZoom: 12,
          interpolate: false,
        });
        this.displacementRange = response.scale_range;

        // Eventually let users define this part somehow
        const defined_stops: (number | number[])[][] = [
          // [Stop, Color[R,G,B]]
          [1.0, [0, 18, 97]],
          [29.0, [3, 62, 125]],
          [58.0, [30, 111, 157]],
          [86.0, [113, 168, 196]],
          [114.0, [201, 221, 231]],
          [143.0, [234, 206, 189]],
          [171.0, [211, 151, 116]],
          [199.0, [190, 101, 51]],
          [228.0, [139, 39, 6]],
          [256.0, [89, 0, 8]],
        ];

        const parsed_color_stops = defined_stops.flat().map((x) => {
          if (Array.isArray(x)) {
            return ['color', ...x, ['band', 4]];
          } else {
            return x;
          }
        });
        this.displacementOverview.setStyle({
          color: [
            'interpolate',
            ['linear'],
            ['*', ['band', 1], 255],
            ...parsed_color_stops,
          ],
        });

        this.displacementOverview.setSource(overview_source);
      });
  }
  public clearDisplacementOverview() {
    this.displacementOverview.setSource(null);
    this.displacementOverview$.next(null);
  }
  public setDisplacementType(type) {
    this.displacementOverview$.next(type);
  }

  public setDisplacementLayer(
    points: {
      seriesNumber: number;
      color: string;
      frames: models.TimeseriesSubframe[];
      base_wkt: string;
      uuid: string;
    }[],
  ) {
    if (this.displacmentLayer) {
      this.map.removeLayer(this.displacmentLayer);
      this.displacmentLayer = null;
    }
    const self = this;

    const features = [];
    points.forEach((dataPoint) => {
      if (dataPoint.frames?.length > 1) {
        for (let i = 0; i < dataPoint.frames.length; i++) {
          const temp_feature = this.wktService.wktToFeature(
            dataPoint.frames[i].wkt,
            this.epsg(),
          );

          temp_feature.set('point', temp_feature.getGeometry()); // use genned one
          temp_feature.set('uuid', dataPoint.frames[i].uuid);
          temp_feature.set('seriesColor', dataPoint.color);
          temp_feature.set('seriesNumber', dataPoint.seriesNumber);
          temp_feature.set('index', i + 1);
          features.push(temp_feature);
        }
      } else {
        const temp_feature = this.wktService.wktToFeature(
          dataPoint.base_wkt,
          this.epsg(),
        );
        temp_feature.set('point', temp_feature.getGeometry());
        temp_feature.set('uuid', dataPoint.uuid);
        temp_feature.set('seriesNumber', dataPoint.seriesNumber);
        temp_feature.set('seriesColor', dataPoint.color);
        features.push(temp_feature);
      }
    });

    const source = new VectorSource({
      features,
    });
    const stylize = function StyleFunction(feature: Feature) {
      const textFunction = function (f: Feature) {
        const labelContent = f.get('index')
          ? `${f.get('seriesNumber')}.${f.get('index')}`
          : `${f.get('seriesNumber')}`;
        return labelContent.toString();
      };

      const textColorFunction = function (f: Feature) {
        const color: string = f.get('seriesColor') ?? '#000000';
        return color;
      };

      const selected =
        feature.get('uuid') === self.pointHistoryService.selectedPoint;

      const zoom = self.map.getView().getZoom();
      let font_size = zoom > 8 ? 1.3 * zoom : 0.9 * zoom;
      if (feature.getGeometry().getType() === 'Point') {
        font_size = 13;
      }
      const layerStyle = new Style({
        image: new CircleStyle({
          stroke: new Stroke({
            color: selected ? 'red' : '#ffcc33',
            width: selected ? 3 : 2,
          }),
          radius: selected ? 12 : 10,
          fill: new Fill({
            color: textColorFunction(feature),
          }),
        }),
        fill: new Fill({
          color: textColorFunction(feature),
        }),
        stroke: new Stroke({
          color: selected ? 'red' : '#ffcc33',
          width: selected ? 3 : 2,
        }),
        text: new olText({
          // font: (selected) ? 'bold 16px sans-serif' : '13px sans-serif',
          font: selected
            ? `bold ${font_size + 1}px sans-serif`
            : `${font_size}px sans-serif`,

          fill: new Fill({
            color: '#000000',
          }),
          text: textFunction(feature),
        }),
        zIndex: selected
          ? 1000
          : feature.get('index')
            ? +feature.get('seriesNumber') + +feature.get('index')
            : +feature.get('seriesNumber'),
      });

      return layerStyle;
    };

    this.displacmentLayer = new VectorLayer({
      source: source,
      style: stylize,
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
    const scenesWithBrowse = scenes
      .filter((scene) => scene.browses?.length > 0)
      .slice(0, 10);

    const collection = scenesWithBrowse.reduce(
      (prev, curr) =>
        prev.concat(
          this.browseOverlayService.createNormalImageLayer(
            curr.browses[0],
            curr.metadata.polygon,
          ),
        ),
      [] as Layer[],
    );

    collection.forEach((element) => {
      this.map.addLayer(element);
    });
  }

  public clearBrowseOverlays() {
    this.pinnedProducts.getLayers().clear();
    if (this.browseImageLayer) {
      this.map.removeLayer(this.browseImageLayer);
    }
  }
  public clearTimeseriesOverlay() {
    this.map.removeLayer(this.displacmentLayer);
    this.displacmentLayer = null;
  }

  public updateBrowseOpacity(opacity: number) {
    this.browseImageLayer?.setOpacity(opacity);
    this.pinnedProducts?.setOpacity(opacity);
  }
  public updateCoherenceOpacity(opacity: number) {
    this.layerService.coherenceLayer?.setOpacity(opacity);
  }
  public updateVelocityOpacity(opacity: number) {
    this.displacementOverview?.setOpacity(opacity);
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
      units: 'metric',
    });
    this.map.addControl(this.scaleLine);
  }

  public setLayerText(text: string): void {
    const style = this.selectedLayer.getStyle() as Style;
    const olText = style.getText();
    olText.setText(text);
  }

  private getPointIntersection(
    aoi: Feature<Geometry>,
    polygon: Feature<Geometry>,
  ): boolean {
    const point = aoi.getGeometry() as Point;

    return booleanPointInPolygon(point.getCoordinates(), {
      type: 'Polygon',
      coordinates: [(polygon.getGeometry() as Polygon).getCoordinates()[0]],
    });
  }

  private getLineIntersection(
    aoi: Feature<Geometry>,
    polygon: Feature<Geometry>,
  ): boolean {
    const line = aoi.getGeometry() as LineString;
    return (
      lineIntersect(
        {
          type: 'LineString',
          coordinates: [...line.getCoordinates()],
        },
        {
          type: 'Polygon',
          coordinates: [(polygon.getGeometry() as Polygon).getCoordinates()[0]],
        },
      ).features.length > 0
    );
  }

  private getPolygonIntersection(
    aoi: Feature<Geometry>,
    polygon: Feature<Geometry>,
  ): boolean {
    return !!intersect(
      {
        type: 'Polygon',
        coordinates: [(aoi.getGeometry() as Polygon).getCoordinates()[0]],
      },
      {
        type: 'Polygon',
        coordinates: [(polygon.getGeometry() as Polygon).getCoordinates()[0]],
      },
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
