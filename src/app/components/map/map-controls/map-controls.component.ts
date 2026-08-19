import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';
import * as sceneStore from '@store/scenes';

import * as models from '@models';
import * as services from '@services';

import { LonLat } from '@models';
import { combineLatest, Observable } from 'rxjs';

import { filter, map, startWith, tap } from 'rxjs/operators';
import { ToggleBrowseOverlay } from '@store/map';
import { NgClass, AsyncPipe, DecimalPipe } from '@angular/common';
import { ViewSelectorComponent } from './view-selector/view-selector.component';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { LayerSelectorComponent } from './layer-selector/layer-selector.component';
import { InteractionSelectorComponent } from '@components/shared/aoi-options/interaction-selector/interaction-selector.component';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MapInfoComponent } from './map-info/map-info.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss'],
  imports: [
    NgClass,

    ViewSelectorComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatTooltip,
    MatIcon,
    LayerSelectorComponent,
    InteractionSelectorComponent,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatSlider,
    MatSliderThumb,
    MapInfoComponent,
    AsyncPipe,
    DecimalPipe,
    TranslateModule,
  ],
})
export class MapControlsComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(services.MapService);
  private browseOverlayService = inject(services.BrowseOverlayService);

  public view$ = this.store$.select(mapStore.getMapView);

  public currentBrowseID = '';

  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public viewTypes = models.MapViewType;
  public mousePos: LonLat;
  public browseOverlayOpacity = this.store$.selectSignal(
    mapStore.getBrowseOverlayOpacity,
  );
  public velocityOverlayOpacity: number;
  public showToolBar = true;
  public toolBarWidth = 571;

  private subs = new SubSink();
  private selectedScene: models.CMRProduct;
  private browseIndex = 0;
  private browseIndexingEnabled = false;

  public selectedScene$ = this.store$.select(sceneStore.getSelectedScene).pipe(
    tap((_) => (this.browseIndex = 0)),
    filter((scene) => !!scene),
    startWith(null),
  );

  public isBrowseOverlayEnabled$: Observable<boolean> =
    this.browseOverlayService.isBrowseOverlayEnabled$;
  public isCoherenceOverlayEnabled$: Observable<any> =
    this.mapService.hasCoherenceLayer$;

  public browseIndexingEnabled$ = combineLatest([
    this.isBrowseOverlayEnabled$,
    this.selectedScene$.pipe(map((scene) => scene?.browses.length > 1)),
  ]).pipe(
    map(
      ([overlayEnabled, multipleBrowses]) => overlayEnabled && multipleBrowses,
    ),
  );

  ngOnInit() {
    this.store$.dispatch(new mapStore.SetVelocityOverlayOpacity(0.8));

    this.subs.add(
      this.mapService.mousePosition$.subscribe((mp) => (this.mousePos = mp)),
    );

    this.subs.add(
      this.store$
        .select(mapStore.getVelocityOverlayOpacity)
        .subscribe(
          (velocityOverlayOpacity) =>
            (this.velocityOverlayOpacity = velocityOverlayOpacity),
        ),
    );
    this.subs.add(
      this.selectedScene$.subscribe((scene) => {
        if (scene) {
          this.currentBrowseID = scene.id;
        }
      }),
    );

    this.subs.add(
      this.store$
        .select(sceneStore.getSelectedScene)
        .pipe(
          filter((event) => !!event),
          tap((_) => (this.browseIndex = 0)),
        )
        .subscribe((event) => (this.selectedScene = event)),
    );

    this.subs.add(
      this.browseIndexingEnabled$.subscribe(
        (isEnabled) => (this.browseIndexingEnabled = isEnabled),
      ),
    );
  }

  public onNewProjection(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public changeState(): void {
    if (this.toolBarWidth === 0) {
      this.toolBarWidth = 571;
      this.showToolBar = true;
    } else {
      this.toolBarWidth = 0;
      this.showToolBar = false;
    }
  }

  public zoomIn(): void {
    this.mapService.zoomIn();
  }

  public zoomOut(): void {
    this.mapService.zoomOut();
  }

  public onSetOpacity(event: any) {
    this.store$.dispatch(
      new mapStore.SetBrowseOverlayOpacity(+event.target.value),
    );
  }

  public onSetCoherenceOpacity(event: any) {
    this.store$.dispatch(
      new mapStore.SetCoherenceOverlayOpacity(+event.target.value),
    );
  }

  public onSetVelocityOpacity(event: any) {
    this.store$.dispatch(
      new mapStore.SetVelocityOverlayOpacity(+event.target.value),
    );
  }

  public onPinProduct(product_id: string) {
    this.store$.dispatch(new ToggleBrowseOverlay(product_id));
  }

  public onUnpinAll() {
    this.store$.dispatch(new mapStore.ClearBrowseOverlays());
  }

  public onIncrementBrowseIndex() {
    const newIndex =
      this.browseIndex === this.getBrowseCount() - 1 ? 0 : this.browseIndex + 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onDecrementBrowseIndex() {
    const newIndex =
      this.browseIndex === 0 ? this.getBrowseCount() - 1 : this.browseIndex - 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onUpdateBrowseIndex(newIndex: number) {
    if (!this.browseIndexingEnabled) {
      return;
    }

    this.browseIndex = newIndex;
    const [url, wkt] = [
      this.selectedScene.browses[this.browseIndex],
      this.selectedScene.metadata.polygon,
    ];

    // for OPERA-S1 geotiffs
    // if(this.selectedScene?.id.startsWith('OPERA')) {
    //   url = this.selectedScene.downloadUrl;
    // }

    this.mapService.setSelectedBrowse(url, wkt, this.selectedScene);
  }

  private getBrowseCount() {
    return this.selectedScene.browses.length;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
