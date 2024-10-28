import {
  Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import {
  map, filter, switchMap, tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';

import tippy, {followCursor} from 'tippy.js';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { MapService, WktService, ScreenSizeService, ScenesService, SarviewsEventsService, PointHistoryService } from '@services';
import * as polygonStyle from '@services/map/polygon.style';
import { CMRProduct, SarviewsEvent } from '@models';
import { StyleLike } from 'ol/style/Style';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { MatDialog } from '@angular/material/dialog';
import WKT from 'ol/format/WKT';

enum FullscreenControls {
  MAP = 'Map',
  DRAW = 'Draw',
  NONE = 'None'
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy  {
  @Output() loadUrlState = new EventEmitter<void>();
  @ViewChild('overlay', { static: true }) overlayRef: ElementRef;
  @ViewChild('map', { static: true }) mapRef: ElementRef;
  @ViewChild('browsetooltip', {static: false}) browseDisclaimer: ElementRef;

  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public mousePosition$ = this.mapService.mousePosition$;
  public isFiltersMenuOpen: boolean;

  public banners$ = this.store$.select(uiStore.getBanners);

  public view$ = this.store$.select(mapStore.getMapView);
  public areResultsLoaded$ = this.store$.select(scenesStore.getAreProductsLoaded);

  public viewTypes = models.MapViewType;

  public tooltip;
  public overlay: Overlay;
  public currentOverlayPosition;
  public shouldShowOverlay: boolean;
  public isResultsMenuOpen: boolean;

  public fullscreenControl = FullscreenControls.NONE;
  public fc = FullscreenControls;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;

  public selectedScene: CMRProduct;
  public selectedSarviewEvent: SarviewsEvent;

  private subs = new SubSink();
  private gridlinesActive$ = this.store$.select(mapStore.getAreGridlinesActive);
  private isMapInitialized$ = this.store$.select(mapStore.getIsMapInitialization);
  private viewType$ = combineLatest([
    this.store$.select(mapStore.getMapView),
    this.store$.select(mapStore.getMapLayerType),]
  );

  private sarviewsEvents: SarviewsEvent[];

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private wktService: WktService,
    private screenSize: ScreenSizeService,
    private scenesService: ScenesService,
    private eventMonitoringService: SarviewsEventsService,
    public dialog: MatDialog,
    private pointHistoryService: PointHistoryService
  ) {}

  ngOnInit(): void {
    this.subs.add(
    this.mapService.selectedSarviewEvent$.pipe(
      filter(id => !!id)
    ).subscribe(
      id => this.selectedSarviewEvent = this.sarviewsEvents?.find(event => event?.event_id === id)
    ));

    this.subs.add(
      this.store$.select(scenesStore.getSelectedScene).subscribe(
        scene => this.selectedScene = scene
      )
    );


    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getIsResultsMenuOpen).subscribe(
        isOpen => this.isResultsMenuOpen = isOpen
      )
    );

    this.subs.add(
      combineLatest([
        this.store$.select(uiStore.getIsResultsMenuOpen),
        this.mapService.searchPolygon$]
      ).pipe(
        filter(_ => !!this.overlay),
        map(([isResultsMenuOpen, polygon]) => !isResultsMenuOpen && !!polygon),
      ).subscribe(
        shouldShowOverlay => shouldShowOverlay ?
          this.showOverlay() :
          this.hideOverlay()
      )
    );

    this.subs.add(
      this.interactionMode$.subscribe(
        mode => {
          if (mode === models.MapInteractionModeType.NONE) {
            this.mapService.enableInteractions();
          }
          else {
            this.mapService.disableInteractions();
          }
        }
      )
    );

    this.tooltip = (<any[]>tippy('#map', {
      content: 'Click to start drawing',
      offset: '15, 0',
      hideOnClick: false,
      placement: 'bottom-end',
      followCursor: true,
      plugins: [followCursor]
    })).pop();

    this.overlay = new Overlay({
      element: this.overlayRef.nativeElement,
    });

    this.updateMapOnViewChange();
    this.redrawSearchPolygonWhenViewChanges();
    this.updateDrawMode();

    this.subs.add(
      this.interactionMode$.subscribe(
        mode => this.mapService.setInteractionMode(mode)
      )
    );

    this.subs.add(
      this.gridlinesActive$.subscribe(
        active => this.mapService.setGridLinesActive(active)
      )
    );

    this.subs.add(
      combineLatest([
        this.mapService.isDrawing$,
        this.drawMode$,
        this.interactionMode$]
      ).pipe(
        map(([isDrawing, drawMode, interactionMode]) => {
          if (interactionMode === models.MapInteractionModeType.DRAW) {
            if (drawMode === models.MapDrawModeType.POINT) {
              return 'Click point';
            }

            if (!isDrawing) {
              return 'Click to start drawing';
            }

            if (drawMode === models.MapDrawModeType.BOX || drawMode === models.MapDrawModeType.CIRCLE) {
              return 'Click to stop drawing';
            } else if (drawMode === models.MapDrawModeType.LINESTRING || drawMode === models.MapDrawModeType.POLYGON) {
              return 'Double click to stop drawing';
            }
          } else if (interactionMode === models.MapInteractionModeType.EDIT) {
            return 'Click and drag on area of interest';
          } else if (interactionMode === models.MapInteractionModeType.TIMERSERIES) {
            return 'Click to select a point for time series analysis';
          }
        })
      ).subscribe(
        tip => this.tooltip.setContent(tip)
      )
    );

    this.subs.add(
      this.interactionMode$.pipe(
        map(mode => mode === models.MapInteractionModeType.DRAW),
      ).subscribe(isDrawMode => {
        if (isDrawMode) {
          this.tooltip.enable();
        } else {
          this.tooltip.hide();
          this.tooltip.disable();
        }
      })
    );

    this.subs.add(
      this.mapService.newSelectedScene$.pipe(
        map(sceneId => new scenesStore.SetSelectedScene(sceneId))
      ).subscribe(
        action => this.store$.dispatch(action)
      )
    );

    this.subs.add(
      this.mapService.newSelectedDisplacement$.subscribe(point => {
        let format = new WKT();
        let wktRepresenation  = format.writeGeometry(point);

        let pointIndex = this.pointHistoryService.getHistory().findIndex((thing) => {
          if(thing === point) {
            return true
          }
        })
        this.pointHistoryService.selectedPoint = pointIndex;

        this.mapService.loadPolygonFrom(wktRepresenation.toString())
      })
    )

    this.subs.add(
      this.store$.select(uiStore.getIsFiltersMenuOpen).subscribe(
        isOpen => this.isFiltersMenuOpen = isOpen
      )
    );

  }

  public onFileHovered(e): void {
    if (!this.isFiltersMenuOpen && this.searchType === models.SearchType.DATASET) {
      this.store$.dispatch(new uiStore.OpenAOIOptions());
    }
    e.preventDefault();
  }

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onNewSearchPolygon(polygon: string): void {
    const features = this.loadSearchPolygon(polygon);

    this.mapService.zoomToFeature(features);
  }

  public onFileUploadDialogClosed(successful: boolean): void {
    const newMode = successful ?
    models.MapInteractionModeType.EDIT :
    models.MapInteractionModeType.NONE;

    this.onNewInteractionMode(newMode);
  }

  public removeBanner(banner: models.Banner): void {
   this.store$.dispatch(new uiStore.RemoveBanner(banner));
  }

  public enterDrawPopup(): void {
    this.tooltip.hide();
  }

  public leaveDrawPopup(): void {
    this.tooltip.show();
  }

  public onSetEditMode(): void {
    this.store$.dispatch(
      new mapStore.SetMapInteractionMode(models.MapInteractionModeType.EDIT)
    );
  }

  private updateMapOnViewChange(): void {
    this.subs.add(
      this.viewType$.pipe(
        withLatestFrom(this.isMapInitialized$),
        filter(([_, isInit]) => !isInit),
        map(([view, _]) => view)
      ).subscribe(
        ([view, layerType]) => {
          this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>layerType);
          this.loadUrlState.emit();
          this.store$.dispatch(new mapStore.MapInitialized());
        }
      )
    );

    const selectedScene$ = this.store$.select(scenesStore.getSelectedScene);

    this.subs.add(
      this.selectedToLayer$(selectedScene$).pipe(
        map(
          (scene: models.CMRProduct) => this.wktService.wktToFeature(
            scene.metadata.polygon,
            this.mapService.epsg()
          )
        ),
      ).subscribe(
        feature => {
          if(this.searchType !== this.searchTypes.DISPLACEMENT){
            this.mapService.setSelectedFeature(feature)
          }}
      )
    );

    const selectedPair$ = this.store$.select(scenesStore.getSelectedPair);

    this.subs.add(
      this.selectedToLayer$(selectedPair$).pipe(
        filter((pair: models.CMRProductPair) => !!pair?.[0] && !!pair?.[1]),
        map(
          (pair: models.CMRProductPair) => pair.map(
            scene => this.wktService.wktToFeature(
              scene.metadata.polygon,
              this.mapService.epsg()
            )
          )
        ),
      ).subscribe(
        features => this.mapService.setSelectedPair(features)
      )
    );

    this.subs.add(
      this.store$.select(mapStore.getIsOverviewMapOpen).subscribe(
        isOpen => this.mapService.setOverviewMap(isOpen)
      )
    );
  }

  private selectedToLayer$(selected$) {
    const scenesLayerAfterInitialization$ = this.isMapInitialized$.pipe(
      filter(isMapInitialized => isMapInitialized),
      switchMap(_ => this.viewType$),
    );

    this.subs.add(
      scenesLayerAfterInitialization$.pipe(
        tap(([view, mapLayerType]) =>
          this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>mapLayerType)
        ),
        switchMap(_ =>
          combineLatest([
            this.mapService.searchPolygon$.pipe(
              map(wkt => !!wkt ? this.wktService.wktToFeature(wkt, this.mapService.epsg()) : null)),
          this.scenesToFeatures(this.mapService.epsg()),
          ])
        ),
        map(([searchPolygon, features]) => {
          let polygonFeatures = features;
          if (this.searchType === models.SearchType.SBAS && searchPolygon != null) {
            const geometryType = searchPolygon.getGeometry().getType();
            const intersectionMethod = this.mapService.getAoiIntersectionMethod(geometryType);

            polygonFeatures = features.filter(feature => intersectionMethod(searchPolygon, feature));
          }
          if(this.searchType === this.searchTypes.DISPLACEMENT) {
            // TODO: Remove placeholder frame when more data arrives
            let vectorFeature = this.wktService.wktToFeature(
              'POLYGON ((-149.451139279365 62.1287442968912, -149.489207371942 62.045616952959, -149.476221395717 62.0129791068178, -149.519088628246 61.955889388159, -149.536405309494 61.854259222719, -149.586547633797 61.725062981579, -149.594933718237 61.6491856726608, -149.81365221469 60.9678772131571, -149.835750622071 60.9420795477735, -149.859662107215 60.8380786660427, -149.904017634358 60.7487221866998, -149.925244567858 60.643143005989, -148.495889771202 60.5277410743715, -148.470041402483 60.584602367533, -146.906606463731 60.4396563701975, -146.873685244838 60.4951172124558, -145.386267125578 60.3396641673686, -145.290423628369 60.5402632158137, -145.280500106703 60.5829732084687, -145.301225650796 60.5845853001108, -145.236822870895 60.6909796637016, -145.247262492305 60.7010850131082, -145.224251585634 60.7495463006203, -145.232581050756 60.7682458705588, -145.187153890321 60.8021251581012, -145.208019152527 60.8234194914492, -145.058111527729 61.0387595374364, -145.099374030659 61.0732930019398, -145.024138665138 61.1204393557309, -145.047326954518 61.1417906129957, -145.030470686787 61.1886939957555, -144.963180408383 61.2453544268513, -144.984671478238 61.2677677145688, -144.976235627719 61.337959599446, -144.89834894171 61.4289187444297, -144.910469614585 61.4579328980322, -144.890927390867 61.4721803217938, -144.897062103683 61.4897872096134, -144.874529671332 61.5309281203528, -144.843140879426 61.5522585942678, -144.843705014899 61.5929497163114, -144.762933706766 61.6622405486587, -144.700945264316 61.8174811273622, -146.289453228815 61.9803053628305, -146.329597119308 61.9247592198443, -147.983354118586 62.073430473257, -148.010743582664 62.0164065972356, -149.451139279365 62.1287442968912))',
              'EPSG:3857'
            )
            return this.featuresToSource([vectorFeature], polygonStyle.staticAOI)
          }

          return this.scenePolygonsLayer(polygonFeatures);
        }),
      ).subscribe(
        layer => this.mapService.setLayer(layer)
      )
    );

    this.subs.add(
      this.sceneSARViewsEventsLayer$(this.mapService.epsg()).pipe(
        filter(layers => !!layers),
      ).subscribe(
        sarviewsEventsLayer =>
          this.mapService.setEventsLayer(sarviewsEventsLayer)
      )
    );

    const selectedAfterInitialization$ = this.isMapInitialized$.pipe(
      filter(isMapInitialized => isMapInitialized),
      switchMap(_ => this.viewType$),
      switchMap(_ => selected$),
    );

    return selectedAfterInitialization$.pipe(
      tap(scene => !!scene ? this.mapService.clearSelectedScene() : null),
      filter(g => g !== null),
    );
  }
  /*
   * */

  private redrawSearchPolygonWhenViewChanges(): void {
    this.subs.add(
      this.viewType$.pipe(
        withLatestFrom(this.mapService.searchPolygon$),
        map(([_, polygon]) => polygon),
        filter(polygon => !!polygon),
      ).subscribe(
        polygon => this.loadSearchPolygon(polygon)
      )
    );
  }

  private updateDrawMode(): void {
    this.subs.add(
      this.store$.select(mapStore.getMapDrawMode).subscribe(
        mode => this.mapService.setDrawMode(mode)
      )
    );
  }

  private loadSearchPolygon = (polygon: string) => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);

    return features;
  }

  private scenesToFeatures(projection: string): Observable<Feature<Geometry>[]> {
    return this.scenesService.scenes$.pipe(
      map(scenes => scenes.filter(scene => scene.id !== this.selectedScene?.id)),
      map(scenes => this.scenesToFeature(scenes, projection)));
  }

  public scenePolygonsLayer(features: Feature<Geometry>[]): VectorLayer<VectorSource> {
      const vectorLayer = this.featuresToSource(features, polygonStyle.scene);
      vectorLayer.set('selectable', 'true');
      return vectorLayer;
  }

  private sceneSARViewsEventsLayer$(projection: string): Observable<VectorLayer<VectorSource>> {
    return this.eventMonitoringService.filteredSarviewsEvents$().pipe(
      // filter(events => !!events),
      tap(events => this.sarviewsEvents = events),
      map(events => this.mapService.sarviewsEventsToFeatures(events, projection)),
      map(features => this.featuresToSource(features, polygonStyle.icon)),
      tap(vectorLayer => vectorLayer.set('selectable_events', true))
    );
  }

  private scenesToFeature(scenes: models.CMRProduct[], projection: string) {
    const features = scenes
      .map(g => {
        const wkt = g.metadata.polygon;
        const feature = this.wktService.wktToFeature(wkt, projection);
        feature.set('filename', g.id);

        return feature;
      });

    return features;
  }

  public sarviewsEventsToFeature(events: SarviewsEvent[], projection: string) {
    const features = events
      .map(sarviewEvent => {
        const wkt = sarviewEvent.wkt;
        const feature = this.wktService.wktToFeature(wkt, projection);
        feature.set('filename', sarviewEvent.description);

        const polygon = feature.getGeometry()[0][0].slice(0, 4);

        if (polygon.length === 2) {
          const eventPoint = new Point([polygon[0], polygon[1]]);
          feature.set('eventPoint', eventPoint);
          feature.setGeometryName('eventPoint');
          return feature;
        }

        const centerLat = (polygon[0][0] + polygon[1][0] + polygon[2][0] + polygon[3][0]) / 4.0;
        const centerLon = (polygon[0][1] + polygon[1][1] + polygon[2][1] + polygon[3][1]) / 4.0;
        const point = new Point([centerLat, centerLon]);


        feature.set('eventPoint', point);
        feature.setGeometryName('eventPoint');

        return feature;
      });

      return features;
  }

  private featuresToSource(features, style: StyleLike): VectorLayer<VectorSource> {
    const layer = new VectorLayer({
      source: new VectorSource({
        features, wrapX: true
      }),
      style
    });

    return layer;
  }

  private setMapWith(viewType: models.MapViewType, layerType: models.MapLayerTypes): void {
    this.mapService.setMapView(viewType, layerType, this.overlay);

    this.mapService.setOverlayUpdate(_ => { });
  }

  public showOverlay(): void {
    this.overlay.setPosition(this.currentOverlayPosition);
  }

  public hideOverlay(): void {
    this.overlay.setPosition(undefined);
  }

  public openDrawControl() {
    this.fullscreenControl = FullscreenControls.DRAW;
  }

  public openMapControl() {
    this.fullscreenControl = FullscreenControls.MAP;
  }

  public closeMobileFullscreenControls() {
    this.fullscreenControl = FullscreenControls.NONE;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
