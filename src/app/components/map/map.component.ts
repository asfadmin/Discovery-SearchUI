import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef
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

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { MapService, WktService } from '@services';
import * as polygonStyle from '@services/map/polygon.style';

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
export class MapComponent implements OnInit {
  @Output() loadUrlState = new EventEmitter<void>();
  @ViewChild('overlay', { static: true }) overlayRef: ElementRef;
  @ViewChild('map', { static: true }) mapRef: ElementRef;

  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public mousePosition$ = this.mapService.mousePosition$;
  public banners$ = this.store$.select(uiStore.getBanners);

  public tooltip;
  public overlay: Overlay;
  public currentOverlayPosition;
  public shouldShowOverlay: boolean;

  private isMapInitialized$ = this.store$.select(mapStore.getIsMapInitialization);
  private viewType$ = combineLatest(
    this.store$.select(mapStore.getMapView),
    this.store$.select(mapStore.getMapLayerType),
  );

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private wktService: WktService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.store$.select(uiStore.getIsBottomMenuOpen),
      this.mapService.searchPolygon$
    ).pipe(
      filter(_ => !!this.overlay),
      map(([isBottomMenuOpen, polygon]) => !isBottomMenuOpen && !!polygon),
    ).subscribe(
      shouldShowOverlay => shouldShowOverlay ?
        this.showOverlay() :
        this.hideOverlay()
    );

    this.store$.select(uiStore.getIsBottomMenuOpen).subscribe(
      isOpen => {
        const mode = isOpen ?
          models.MapInteractionModeType.NONE :
          models.MapInteractionModeType.DRAW;
        this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
    });

    this.interactionMode$.subscribe(
      mode => {
        if (mode === models.MapInteractionModeType.NONE) {
          this.mapService.enableInteractions();
        } else {
          this.mapService.disableInteractions();
        }
      }
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

    this.interactionMode$.subscribe(
      mode => this.mapService.setInteractionMode(mode)
    );

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
    ).subscribe(tip => this.tooltip.setContent(tip));

    this.interactionMode$.pipe(
      map(mode => mode === models.MapInteractionModeType.DRAW),
    ).subscribe(isDrawMode => {
      if (isDrawMode) {
        this.tooltip.enable();
      } else {
        this.tooltip.hide();
        this.tooltip.disable();
      }
    });

    this.mapService.newSelectedGranule$.pipe(
      map(granuleId => new granulesStore.SetSelectedGranule(granuleId))
    ).subscribe(
      action => this.store$.dispatch(action)
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
    const viewBeforInitialization = this.viewType$.pipe(
      withLatestFrom(this.isMapInitialized$),
      filter(([view, isInit]) => !isInit),
      map(([view, isInit]) => view)
    ).subscribe(
      ([view, layerType]) => {
        this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>layerType);
        this.loadUrlState.emit();
        this.store$.dispatch(new mapStore.MapInitialzed());
      }
    );

    this.granuleToLayer$('SELECTED').subscribe(
      feature => this.mapService.setSelectedFeature(feature)
    );

    this.granuleToLayer$('FOCUSED').subscribe(
      feature => this.mapService.setFocusedFeature(feature)
    );
  }

  private granuleToLayer$(layerType: string) {
    const granule$ = layerType === 'FOCUSED' ?
      this.store$.select(granulesStore.getFocusedGranule) :
      this.store$.select(granulesStore.getSelectedGranule);

    const granulesLayerAfterInitialization$ = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => this.viewType$),
    );

    granulesLayerAfterInitialization$.pipe(
      tap(([view, mapLayerType]) =>
        this.setMapWith(<models.MapViewType>view, <models.MapLayerTypes>mapLayerType)
      ),
      switchMap(_ =>
        this.granulePolygonsLayer$(this.mapService.epsg())
      )
    ).subscribe(
      layer => this.mapService.setLayer(layer)
    );

    const selectedGranuleAfterInitialization$ = this.isMapInitialized$.pipe(
      filter(isMapInitiliazed => isMapInitiliazed),
      switchMap(_ => this.viewType$),
      switchMap(_ => granule$),
    );

    return selectedGranuleAfterInitialization$.pipe(
      tap(granule => !!granule || (layerType === 'FOCUSED') ?
        this.mapService.clearFocusedGranule() :
        this.mapService.clearSelectedGranule()
      ),
      filter(g => g !== null),
      map(
        granule => this.wktService.wktToFeature(
          granule.metadata.polygon,
          this.mapService.epsg()
        )
      ),
    );
  }

  private redrawSearchPolygonWhenViewChanges(): void {
    this.viewType$.pipe(
      withLatestFrom(this.mapService.searchPolygon$),
      map(([_, polygon]) => polygon),
      filter(polygon => !!polygon),
    ).subscribe(
      polygon => this.loadSearchPolygon(polygon)
    );
  }

  private updateDrawMode(): void {
    this.store$.select(mapStore.getMapDrawMode).subscribe(
      mode => this.mapService.setDrawMode(mode)
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

  private granulePolygonsLayer$(projection: string): Observable<VectorSource> {
    return this.store$.select(granulesStore.getGranules).pipe(
      distinctUntilChanged(),
      map(granules => this.granulesToFeature(granules, projection)),
      map(features => this.featuresToSource(features))
    );
  }

  private granulesToFeature(granules: models.CMRProduct[], projection: string) {
    return granules
      .map(g => {
        const wkt = g.metadata.polygon;
        const feature = this.wktService.wktToFeature(wkt, projection);
        feature.set('filename', g.id);

        return feature;
      });
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
}
