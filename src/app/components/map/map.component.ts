import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';

import tippy, { followCursor } from 'tippy.js';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';
import * as sceneStore from '@store/scenes';
import * as models from '@models';
import { CMRProduct, SarviewsEvent } from '@models';
import {
  DisplacementDisclaimerService,
  MapService,
  PointHistoryService,
  SarviewsEventsService,
  ScenesService,
  ScreenSizeService,
  WktService,
} from '@services';
import * as polygonStyle from '@services/map/polygon.style';
import { StyleLike } from 'ol/style/Style';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import WKT from 'ol/format/WKT';
import { getTimeseriesChartStates } from '@store/charts';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MapControlsComponent } from './map-controls/map-controls.component';
import { DisplacementLayersComponent } from './displacement-layers/displacement-layers.component';
import { BannersComponent } from './banners/banners.component';
import { InteractionSelectorComponent } from '@components/shared/aoi-options/interaction-selector/interaction-selector.component';
import { ViewSelectorComponent } from './map-controls/view-selector/view-selector.component';
import { LayerSelectorComponent } from './map-controls/layer-selector/layer-selector.component';
import { FiltersDropdownComponent } from '../filters-dropdown/filters-dropdown.component';
import { FileUploadComponent } from '@components/shared/aoi-options/file-upload/file-upload.component';
import { AttributionsComponent } from './attributions/attributions.component';
import { TranslateModule } from '@ngx-translate/core';

enum FullscreenControls {
  MAP = 'Map',
  DRAW = 'Draw',
  NONE = 'None',
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [
    MatButton,
    MatIcon,

    MapControlsComponent,
    DisplacementLayersComponent,
    BannersComponent,
    MatFabButton,
    InteractionSelectorComponent,
    ViewSelectorComponent,
    LayerSelectorComponent,
    FiltersDropdownComponent,
    FileUploadComponent,
    AttributionsComponent,
    AsyncPipe,
    TranslateModule,
    MatTooltipModule,
  ],
})
export class MapComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(MapService);
  private wktService = inject(WktService);
  private screenSize = inject(ScreenSizeService);
  private scenesService = inject(ScenesService);
  private eventMonitoringService = inject(SarviewsEventsService);
  dialog = inject(MatDialog);
  private pointHistoryService = inject(PointHistoryService);
  private disclaimerService = inject(DisplacementDisclaimerService);

  @Output() loadUrlState = new EventEmitter<void>();
  @ViewChild('overlay', { static: true }) overlayRef: ElementRef;
  @ViewChild('map', { static: true }) mapRef: ElementRef;
  @ViewChild('browsetooltip', { static: false }) browseDisclaimer: ElementRef;
  @ViewChild('AriaPopup', { static: false })
  ariaPopup: ElementRef<HTMLDivElement>;

  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public mousePosition$ = this.mapService.mousePosition$;
  public isFiltersMenuOpen: boolean;

  public banners$ = this.store$.select(uiStore.getBanners);

  public view$ = this.store$.select(mapStore.getMapView);
  public areResultsLoaded$ = this.store$.select(
    scenesStore.getAreProductsLoaded,
  );

  public viewTypes = models.MapViewType;

  public tooltip;
  public overlay: Overlay;
  public currentOverlayPosition;
  public shouldShowOverlay: boolean;
  public isResultsMenuOpen: boolean;
  public isHyp3PlusMode = this.store$.selectSignal(searchStore.getHyp3PlusMode);

  public fullscreenControl = FullscreenControls.NONE;
  public fc = FullscreenControls;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;

  public selectedScene: CMRProduct;
  public selectedSarviewEvent: SarviewsEvent;
  public SelectedOnDemandFrameID: Feature = null;
  public OnDemandFrames: { frameID: string; feature: Feature<Geometry> }[] = [];
  private subs = new SubSink();
  private gridlinesActive$ = this.store$.select(mapStore.getAreGridlinesActive);
  private isMapInitialized$ = this.store$.select(
    mapStore.getIsMapInitialization,
  );
  private viewType$ = combineLatest([
    this.store$.select(mapStore.getMapView),
    this.store$.select(mapStore.getMapLayerType),
  ]);

  private sarviewsEvents: SarviewsEvent[];
  private chartStates: models.timeseriesChartItemState[] = [];
  //@ts-expect-error Variable used later
  private selectedSeries: any = null;

  public buildOnDemandStack() {
    // let id = feature.get('id')
    this.store$.dispatch(new uiStore.SetFrameSelection(false));
    this.store$.dispatch(new searchStore.ClearSearch());
    this.store$.dispatch(new searchStore.SetSearchType(models.SearchType.SBAS));
    this.store$.dispatch(new filtersStore.SetUseFrameForBaseline(true));
    this.store$.dispatch(
      new sceneStore.SetFilterMaster(this.OnDemandFrames[0].frameID.toString()),
    );
    this.store$.dispatch(new filtersStore.SetSelectedDataset(models.beta.id));
    this.store$.dispatch(new searchStore.MakeSearch());

    this.mapService.setOnDemandSBASFrame(this.OnDemandFrames[0].feature);
    this.mapService.setAriaPopupOverlay(null, null);
  }
  ngOnInit(): void {
    this.mapService.focusedAriaFrame$
      .pipe(
        filter((frame) => !!frame),
        withLatestFrom(this.mapService.mousePosition$),
        withLatestFrom(this.store$.select(searchStore.getSearchType)),
        filter(
          ([[_, __], searchType]) => searchType !== models.SearchType.SBAS,
        ),
      )
      .subscribe(([[frame, lonLat], _]) => {
        this.OnDemandFrames = [{ frameID: frame.get('id'), feature: frame }];
        this.mapService.setOnDemandSBASFrame(this.OnDemandFrames[0].feature);
        // this.zZg1 = frameId.get('id');
        this.mapService.setAriaPopupOverlay(
          this.ariaPopup.nativeElement,
          lonLat,
        );
        // this.ariaPopup.nativeElement
      });
    this.subs.add(
      this.mapService.selectedSarviewEvent$
        .pipe(filter((id) => !!id))
        .subscribe(
          (id) =>
            (this.selectedSarviewEvent = this.sarviewsEvents?.find(
              (event) => event?.event_id === id,
            )),
        ),
    );

    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedScene)
        .subscribe((scene) => (this.selectedScene = scene)),
    );

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        (breakpoint) => (this.breakpoint = breakpoint),
      ),
    );

    this.subs.add(
      this.store$
        .select(searchStore.getSearchType)
        .subscribe((searchType) => (this.searchType = searchType)),
    );

    this.subs.add(
      this.store$
        .select(uiStore.getIsResultsMenuOpen)
        .subscribe((isOpen) => (this.isResultsMenuOpen = isOpen)),
    );

    this.subs.add(
      combineLatest([
        this.store$.select(uiStore.getIsResultsMenuOpen),
        this.mapService.searchPolygon$,
      ])
        .pipe(
          filter((_) => !!this.overlay),
          map(
            ([isResultsMenuOpen, polygon]) => !isResultsMenuOpen && !!polygon,
          ),
        )
        .subscribe((shouldShowOverlay) =>
          shouldShowOverlay ? this.showOverlay() : this.hideOverlay(),
        ),
    );

    this.subs.add(
      this.interactionMode$.subscribe((mode) => {
        if (mode === models.MapInteractionModeType.NONE) {
          this.mapService.enableInteractions();
        } else {
          this.mapService.disableInteractions();
        }
      }),
    );

    this.tooltip = (
      tippy('#map', {
        content: 'Click to start drawing',
        offset: '15, 0',
        hideOnClick: false,
        placement: 'bottom-end',
        followCursor: true,
        plugins: [followCursor],
      }) as any[]
    ).pop();

    this.overlay = new Overlay({
      element: this.overlayRef.nativeElement,
    });

    this.updateMapOnViewChange();
    this.redrawSearchPolygonWhenViewChanges();
    this.updateDrawMode();

    this.subs.add(
      this.interactionMode$.subscribe((mode) =>
        this.mapService.setInteractionMode(mode),
      ),
    );

    this.subs.add(
      this.gridlinesActive$.subscribe((active) =>
        this.mapService.setGridLinesActive(active),
      ),
    );

    this.subs.add(
      combineLatest([
        this.store$.select(uiStore.getIsFrameSelectionEnabled),
        this.store$.select(filtersStore.getSelectedDatasetId),
        this.store$.select(filtersStore.getFlightDirections),
        this.store$.select(filtersStore.getFrameRange),
        this.store$.select(filtersStore.getPathRange),
        this.store$.select(searchStore.getSearchType),
      ]).subscribe(
        ([
          enabled,
          datasetId,
          directions,
          frameRange,
          pathRange,
          searchType,
        ]) => {
          const dataset = models.datasets[datasetId];
          if (
            enabled &&
            !dataset.properties.find((a) => a === models.Props.FRAME_ORDERING)
          ) {
            // this dataset doesn't support frame ordering, disable
            this.store$.dispatch(new uiStore.SetFrameSelection(false));
            this.mapService.setFrameSelectionActive(false);
          } else if (enabled && searchType == this.searchTypes.DATASET) {
            this.mapService.setFrameSelectionActive(
              true,
              dataset.frameMap[directions[0]?.toLowerCase() ?? 'ascending'],
              frameRange,
              pathRange,
            );
            this.store$.dispatch(
              new mapStore.SetMapInteractionMode(
                models.MapInteractionModeType.NONE,
              ),
            ); // disable so we can actually pick a frame
          } else {
            this.mapService.setFrameSelectionActive(false);
          }
        },
      ),
    );

    this.subs.add(
      combineLatest([
        this.store$.select(uiStore.getIsFrameSelectionEnabled),
        this.store$.select(filtersStore.getPathRange),
        this.store$.select(filtersStore.getFrameRange),
      ]).subscribe(([enabled, path, frame]) => {
        if (enabled) {
          this.mapService.filterFrameOverlay(path, frame);
        }
      }),
    );
    this.subs.add(
      combineLatest([
        this.store$.select(filtersStore.getShouldUseFramesForReference),
        this.store$.select(sceneStore.getFilterMaster), // frame id for things
        this.store$.select(filtersStore.getSelectedDataset),
      ]).subscribe(([shouldUseFramesForReference, filterMaster, dataset]) => {
        // TODO: load in frame map instead of grabbing previous frame map feature
        this.mapService.sbasFrameMode(
          !shouldUseFramesForReference,
          filterMaster,
          dataset,
        );
      }),
    );

    this.subs.add(
      combineLatest([
        this.mapService.isDrawing$,
        this.drawMode$,
        this.interactionMode$,
      ])
        .pipe(
          map(([isDrawing, drawMode, interactionMode]) => {
            if (interactionMode === models.MapInteractionModeType.DRAW) {
              if (drawMode === models.MapDrawModeType.POINT) {
                return 'Click point';
              }

              if (!isDrawing) {
                return 'Click to start drawing';
              }

              if (
                drawMode === models.MapDrawModeType.BOX ||
                drawMode === models.MapDrawModeType.CIRCLE
              ) {
                return 'Click to stop drawing';
              } else if (
                drawMode === models.MapDrawModeType.LINESTRING ||
                drawMode === models.MapDrawModeType.POLYGON
              ) {
                return 'Double click to stop drawing';
              }
            } else if (interactionMode === models.MapInteractionModeType.EDIT) {
              return 'Click and drag on area of interest';
            } else if (
              interactionMode === models.MapInteractionModeType.TIMERSERIES
            ) {
              return 'Click to select a point for time series analysis';
            } else {
              return '';
            }
          }),
        )
        .subscribe((tip) => this.tooltip.setContent(tip)),
    );

    this.subs.add(
      this.interactionMode$
        .pipe(map((mode) => mode === models.MapInteractionModeType.DRAW))
        .subscribe((isDrawMode) => {
          if (isDrawMode) {
            this.tooltip.enable();
          } else {
            this.tooltip.hide();
            this.tooltip.disable();
          }
        }),
    );

    this.subs.add(
      this.mapService.newSelectedScene$
        .pipe(map((sceneId) => new scenesStore.SetSelectedScene(sceneId)))
        .subscribe((action) => this.store$.dispatch(action)),
    );

    this.subs.add(
      this.store$
        .select(uiStore.getActiveUUID)
        .pipe(distinctUntilChanged())
        .subscribe((uuid) => {
          this.respondToActiveWkt(uuid);
        }),
    );

    this.subs.add(
      this.store$.select(getTimeseriesChartStates).subscribe((chartStates) => {
        this.chartStates = Object.values(chartStates);
      }),
    );

    this.subs.add(
      this.mapService.newSelectedDisplacement$.subscribe((point) => {
        const format = new WKT();
        const wktRepresentation = format.writeGeometry(point);
        let uuid = null;
        this.pointHistoryService.getHistory().findIndex((thing) => {
          if (thing.point === point) {
            uuid = thing.uuidSeries;
            this.store$.dispatch(new uiStore.SetActiveUUID(thing.uuidSeries));
            return true;
          }
        });
        this.pointHistoryService.selectedPoint = uuid;
        this.mapService.loadPolygonFrom(wktRepresentation.toString());
      }),
    );

    this.subs.add(
      this.store$
        .select(uiStore.getIsFiltersMenuOpen)
        .subscribe((isOpen) => (this.isFiltersMenuOpen = isOpen)),
    );
  }

  public respondToActiveWkt(uuid: string) {
    this.selectedSeries = null;
    this.chartStates.forEach((item) => {
      if (item.uuidSeries == uuid) {
        this.selectedSeries = item;
      }
    });
    this.pointHistoryService.selectedPoint = uuid ?? ''; //this.selectedSeries?.uuidSeries ?? -1;
    this.mapService.displacmentLayer?.changed();
  }

  public onFileHovered(e): void {
    if (
      !this.isFiltersMenuOpen &&
      this.searchType === models.SearchType.DATASET
    ) {
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
    const newMode = successful
      ? models.MapInteractionModeType.EDIT
      : models.MapInteractionModeType.NONE;
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
      new mapStore.SetMapInteractionMode(models.MapInteractionModeType.EDIT),
    );
  }

  private updateMapOnViewChange(): void {
    this.subs.add(
      this.viewType$
        .pipe(
          withLatestFrom(this.isMapInitialized$),
          filter(([_, isInit]) => !isInit),
          map(([view, _]) => view),
        )
        .subscribe(([view, layerType]) => {
          this.setMapWith(
            view as models.MapViewType,
            layerType as models.MapLayerTypes,
          );
          this.loadUrlState.emit();
          this.store$.dispatch(new mapStore.MapInitialized());
        }),
    );

    const selectedScene$ = this.store$.select(scenesStore.getSelectedScene);

    this.subs.add(
      this.selectedToLayer$(selectedScene$)
        .pipe(
          filter((scene: models.CMRProduct) => !!scene.metadata.polygon),
          map((scene: models.CMRProduct) =>
            this.wktService.wktToFeature(
              scene.metadata.polygon,
              this.mapService.epsg(),
            ),
          ),
        )
        .subscribe((feature) => {
          if (this.searchType !== this.searchTypes.DISPLACEMENT) {
            this.mapService.setSelectedFeature(feature);
          }
        }),
    );

    const selectedPair$ = this.store$.select(scenesStore.getSelectedPair);

    this.subs.add(
      this.selectedToLayer$(selectedPair$)
        .pipe(
          filter((pair: models.CMRProductPair) => !!pair?.[0] && !!pair?.[1]),
          map((pair: models.CMRProductPair) =>
            pair.map((scene) =>
              this.wktService.wktToFeature(
                scene.metadata.polygon,
                this.mapService.epsg(),
              ),
            ),
          ),
        )
        .subscribe((features) => this.mapService.setSelectedPair(features)),
    );

    this.subs.add(
      this.store$
        .select(mapStore.getIsOverviewMapOpen)
        .subscribe((isOpen) => this.mapService.setOverviewMap(isOpen)),
    );
  }

  private selectedToLayer$(selected$) {
    const scenesLayerAfterInitialization$ = this.isMapInitialized$.pipe(
      filter((isMapInitialized) => isMapInitialized),
      switchMap((_) => this.viewType$),
    );

    this.subs.add(
      scenesLayerAfterInitialization$
        .pipe(
          tap(([view, mapLayerType]) =>
            this.setMapWith(
              view as models.MapViewType,
              mapLayerType as models.MapLayerTypes,
            ),
          ),
          switchMap((_) =>
            combineLatest([
              this.mapService.searchPolygon$.pipe(
                map((wkt) =>
                  wkt
                    ? this.wktService.wktToFeature(wkt, this.mapService.epsg())
                    : null,
                ),
              ),
              this.scenesToFeatures(this.mapService.epsg()),
            ]),
          ),
          map(([searchPolygon, features]) => {
            let polygonFeatures = features;
            if (
              this.searchType === models.SearchType.SBAS &&
              searchPolygon != null
            ) {
              const geometryType = searchPolygon.getGeometry().getType();
              const intersectionMethod =
                this.mapService.getAoiIntersectionMethod(geometryType);

              polygonFeatures = features.filter((feature) =>
                intersectionMethod(searchPolygon, feature),
              );
            }
            if (this.searchType === this.searchTypes.DISPLACEMENT) {
              const vectorFeature = new Feature();
              return this.featuresToSource(
                [vectorFeature],
                polygonStyle.staticAOI,
              );
            }

            return this.scenePolygonsLayer(polygonFeatures);
          }),
        )
        .subscribe((layer) => this.mapService.setLayer(layer)),
    );

    this.subs.add(
      this.sceneSARViewsEventsLayer$(this.mapService.epsg())
        .pipe(filter((layers) => !!layers))
        .subscribe((sarviewsEventsLayer) =>
          this.mapService.setEventsLayer(sarviewsEventsLayer),
        ),
    );

    const selectedAfterInitialization$ = this.isMapInitialized$.pipe(
      filter((isMapInitialized) => isMapInitialized),
      switchMap((_) => this.viewType$),
      switchMap((_) => selected$),
    );

    return selectedAfterInitialization$.pipe(
      tap((scene) => (scene ? this.mapService.clearSelectedScene() : null)),
      filter((g) => g !== null),
    );
  }
  /*
   * */

  private redrawSearchPolygonWhenViewChanges(): void {
    this.subs.add(
      this.viewType$
        .pipe(
          withLatestFrom(this.mapService.searchPolygon$),
          map(([_, polygon]) => polygon),
          filter((polygon) => !!polygon),
        )
        .subscribe((polygon) => this.loadSearchPolygon(polygon)),
    );
  }

  private updateDrawMode(): void {
    this.subs.add(
      this.store$
        .select(mapStore.getMapDrawMode)
        .subscribe((mode) => this.mapService.setDrawMode(mode)),
    );
  }

  private loadSearchPolygon = (polygon: string) => {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg(),
    );

    this.mapService.setDrawFeature(features);

    return features;
  };

  private scenesToFeatures(
    projection: string,
  ): Observable<Feature<Geometry>[]> {
    return this.scenesService.scenes$.pipe(
      map((scenes) =>
        scenes.filter(
          (scene) =>
            scene.id !== this.selectedScene?.id && !!scene.metadata.polygon,
        ),
      ),
      map((scenes) => this.scenesToFeature(scenes, projection)),
    );
  }

  public scenePolygonsLayer(
    features: Feature<Geometry>[],
  ): VectorLayer<VectorSource> {
    const vectorLayer = this.featuresToSource(features, polygonStyle.scene);
    vectorLayer.set('selectable', 'true');
    return vectorLayer;
  }

  private sceneSARViewsEventsLayer$(
    projection: string,
  ): Observable<VectorLayer<VectorSource>> {
    return this.eventMonitoringService.filteredSarviewsEvents$().pipe(
      // filter(events => !!events),
      tap((events) => (this.sarviewsEvents = events)),
      map((events) =>
        this.mapService.sarviewsEventsToFeatures(events, projection),
      ),
      map((features) => this.featuresToSource(features, polygonStyle.icon)),
      tap((vectorLayer) => vectorLayer.set('selectable_events', true)),
    );
  }

  private scenesToFeature(scenes: models.CMRProduct[], projection: string) {
    const features = scenes
      .filter((scene) => !!scene.metadata.polygon)
      .map((g) => {
        const wkt = g.metadata.polygon;
        const feature = this.wktService.wktToFeature(wkt, projection);
        feature.set('filename', g.id);

        return feature;
      });

    return features;
  }

  public sarviewsEventsToFeature(events: SarviewsEvent[], projection: string) {
    const features = events.map((sarviewEvent) => {
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

      const centerLat =
        (polygon[0][0] + polygon[1][0] + polygon[2][0] + polygon[3][0]) / 4.0;
      const centerLon =
        (polygon[0][1] + polygon[1][1] + polygon[2][1] + polygon[3][1]) / 4.0;
      const point = new Point([centerLat, centerLon]);

      feature.set('eventPoint', point);
      feature.setGeometryName('eventPoint');

      return feature;
    });

    return features;
  }

  private featuresToSource(
    features,
    style: StyleLike,
  ): VectorLayer<VectorSource> {
    const layer = new VectorLayer({
      source: new VectorSource({
        features,
        wrapX: true,
      }),
      style,
    });

    return layer;
  }

  private setMapWith(
    viewType: models.MapViewType,
    layerType: models.MapLayerTypes,
  ): void {
    this.mapService.setMapView(viewType, layerType, this.overlay);

    this.mapService.setOverlayUpdate((_) => {
      // Do nothing
    });
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

  public onOpenDispDisclaimer(): void {
    this.disclaimerService.open();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
