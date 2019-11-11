import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import {
  map, filter, switchMap, tap, skip,
  withLatestFrom, distinctUntilChanged
} from 'rxjs/operators';

import { Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Overlay from 'ol/Overlay';
import { getTopRight } from 'ol/extent';

import tippy from 'tippy.js';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { MapService, WktService, ScreenSizeService } from '@services';
import * as polygonStyle from '@services/map/polygon.style';

enum FullscreenControls {
  MAP = 'Map',
  DRAW = 'Draw',
  NONE = 'None'
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('bannerTransition', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ],
})
export class MapComponent implements OnInit, OnDestroy  {
  @Output() loadUrlState = new EventEmitter<void>();
  @ViewChild('overlay', { static: true }) overlayRef: ElementRef;
  @ViewChild('map', { static: true }) mapRef: ElementRef;

  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public mousePosition$ = this.mapService.mousePosition$;
  public banners$ = this.store$.select(uiStore.getBanners);
  public view$ = this.store$.select(mapStore.getMapView);
  public viewTypes = models.MapViewType;

  public tooltip;
  public overlay: Overlay;
  public currentOverlayPosition;
  public shouldShowOverlay: boolean;

  public fullscreenControl = FullscreenControls.NONE;
  public fc = FullscreenControls;

  private isMapInitialized$ = this.store$.select(mapStore.getIsMapInitialization);
  private viewType$ = combineLatest(
    this.store$.select(mapStore.getMapView),
    this.store$.select(mapStore.getMapLayerType),
  );

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private wktService: WktService,
    private screenSize: ScreenSizeService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      combineLatest(
        this.store$.select(uiStore.getIsResultsMenuOpen),
        this.mapService.searchPolygon$
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
          } else {
            this.mapService.disableInteractions();
          }
        }
      )
    );

    this.tooltip = (<any[]>tippy('#map', {
      content: 'Click to start drawing',
      followCursor: true,
      offset: '15, 0',
      hideOnClick: false,
      placement: 'bottom-end'
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
      combineLatest(
        this.mapService.isDrawing$,
        this.drawMode$,
        this.interactionMode$
      ).pipe(
        map(([isDrawing, drawMode, interactionMode]) => {
          if (interactionMode === models.MapInteractionModeType.DRAW) {
            if (drawMode === models.MapDrawModeType.POINT) {
              return 'Click point';
            }

            if (!isDrawing) {
              return 'Click to start drawing';
            }

            if (drawMode === models.MapDrawModeType.BOX) {
              return 'Click to stop drawing';
            } else if (drawMode === models.MapDrawModeType.LINESTRING || drawMode === models.MapDrawModeType.POLYGON) {
              return 'Double click to stop drawing';
            }
          } else if (interactionMode === models.MapInteractionModeType.EDIT) {
            return 'Click and drag on area of interest';
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
  }

  public onFileHovered(e): void {
    this.onNewInteractionMode(models.MapInteractionModeType.UPLOAD);
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
        filter(([view, isInit]) => !isInit),
        map(([view, isInit]) => view)
      ).subscribe(
        ([view, layerType]) => {
          this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>layerType);
          this.loadUrlState.emit();
          this.store$.dispatch(new mapStore.MapInitialzed());
        }
      )
    );

    this.subs.add(
      this.sceneToLayer$().subscribe(
        feature => this.mapService.setSelectedFeature(feature)
      )
    );
  }

  private sceneToLayer$() {
    const scene$ = this.store$.select(scenesStore.getSelectedScene);

    const scenesLayerAfterInitialization$ = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => this.viewType$),
    );

    this.subs.add(
      scenesLayerAfterInitialization$.pipe(
        tap(([view, mapLayerType]) =>
          this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>mapLayerType)
        ),
        switchMap(_ =>
          this.scenePolygonsLayer$(this.mapService.epsg())
        )
      ).subscribe(
        layer => this.mapService.setLayer(layer)
      )
    );

    const selectedSceneAfterInitialization$ = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => this.viewType$),
      switchMap(_ => scene$),
    );

    return selectedSceneAfterInitialization$.pipe(
      tap(scene => !!scene ? this.mapService.clearSelectedScene() : null),
      filter(g => g !== null),
      map(
        scene => this.wktService.wktToFeature(
          scene.metadata.polygon,
          this.mapService.epsg()
        )
      ),
    );
  }

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

  private scenePolygonsLayer$(projection: string): Observable<VectorSource> {
    return this.store$.select(scenesStore.getScenes).pipe(
      distinctUntilChanged(),
      map(scenes => this.scenesToFeature(scenes, projection)),
      map(features => this.featuresToSource(features))
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

  private featuresToSource(features): VectorSource {
    const layer = new VectorLayer({
      source: new VectorSource({
        features, wrapX: true
      }),
      style: polygonStyle.scene
    });

    layer.set('selectable', 'true');

    return layer;
  }

  private setMapWith(viewType: models.MapViewType, layerType: models.MapLayerTypes): void {
    this.mapService.setMapView(viewType, layerType, this.overlay);

    this.mapService.setOverlayUpdate(feature => {
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
