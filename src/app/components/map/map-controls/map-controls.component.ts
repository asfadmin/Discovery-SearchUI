import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';
import * as sceneStore from '@store/scenes';

import * as models from '@models';
import * as services from '@services';

import { LonLat, SarviewsProduct, SearchType } from '@models';
import { combineLatest, Observable } from 'rxjs';

import { filter, map, startWith, tap } from 'rxjs/operators';
import { ToggleBrowseOverlay} from '@store/map';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit, OnDestroy {
  public view$ = this.store$.select(mapStore.getMapView);
  public browseOverlayOpacity$ = this.store$.select(mapStore.getBrowseOverlayOpacity);
  public pinnedProducts$ = this.store$.select(sceneStore.getImageBrowseProducts);

  public currentBrowseID = '';

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public viewTypes = models.MapViewType;
  public mousePos: LonLat;
  public browseOverlayOpacity: number;
  public showToolBar = true;
  public toolBarWidth = 571;

  private subs = new SubSink();
  private selectedEventProducts: SarviewsProduct[] = [];
  private selectedScene: models.CMRProduct;
  private browseIndex = 0;
  private browseIndexingEnabled = false;

  public selectedScene$ = this.store$.select(sceneStore.getSelectedScene).pipe(
    tap(_ => this.browseIndex = 0),
    filter(scene => !!scene),
  startWith(null));

  public selectedEvent$ = this.store$.select(sceneStore.getSelectedSarviewsProduct).pipe(
    tap(_ => this.browseIndex = 0),
    filter(event => !!event),
  startWith(null));

  public isBrowseOverlayEnabled$: Observable<boolean> = this.browseOverlayService.isBrowseOverlayEnabled$;

  public browseIndexingEnabled$ = combineLatest([
    this.isBrowseOverlayEnabled$,
    this.selectedScene$.pipe(map(scene => scene?.browses.length > 1)),
  ]).pipe(
    map(([overlayEnabled, multipleBrowses]) => overlayEnabled && multipleBrowses)
  );

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
    private browseOverlayService: services.BrowseOverlayService
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.mapService.mousePosition$.subscribe(mp => this.mousePos = mp)
    );

    this.subs.add(
      this.store$.select(mapStore.getBrowseOverlayOpacity).subscribe(
        browseOverlayOpacity => this.browseOverlayOpacity = browseOverlayOpacity
      )
    );


    this.subs.add(
      combineLatest([this.selectedScene$, this.selectedEvent$]).subscribe(
        ([scene, event]) => {
          if (this.searchType === SearchType.SARVIEWS_EVENTS) {
            if (!!event) {
              this.currentBrowseID = event.product_id;
            }
           } else {
             if (!!scene) {
              this.currentBrowseID = scene.id;
             }
            }
          }
      )
    );

    this.subs.add(
      this.store$.select(sceneStore.getSelectedSarviewsEventProducts)
      .pipe(filter(eventProducts => !!eventProducts))
      .subscribe(
        eventProducts => this.selectedEventProducts = eventProducts
      )
    );

    this.subs.add(
      this.store$.select(sceneStore.getSelectedScene)
      .pipe(
        filter(event => !!event),
        tap(_ => this.browseIndex = 0))
      .subscribe(
        event => this.selectedScene = event
      )
    );

    this.subs.add(
      this.browseIndexingEnabled$.subscribe(
        isEnabled => this.browseIndexingEnabled = isEnabled
      )
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

  public onSetOpacity(event: MatSliderChange) {
    this.store$.dispatch(new mapStore.SetBrowseOverlayOpacity(event.value));
  }


  public onPinProduct(product_id: string) {
    this.store$.dispatch(new ToggleBrowseOverlay(product_id));
  }

  public onUnpinAll() {
    this.store$.dispatch(new mapStore.ClearBrowseOverlays());
  }

  public onIncrementBrowseIndex() {
    const newIndex = this.browseIndex === this.getBrowseCount() - 1 ? 0 : this.browseIndex + 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onDecrementBrowseIndex() {
    const newIndex = this.browseIndex === 0 ? this.getBrowseCount() - 1 : this.browseIndex - 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onUpdateBrowseIndex(newIndex: number) {
    if (!this.browseIndexingEnabled) {
      return;
    }

    this.browseIndex = newIndex;
    const [url, wkt] = this.searchType === SearchType.SARVIEWS_EVENTS
    ? [this.selectedEventProducts[this.browseIndex].files.browse_url, this.selectedEventProducts[this.browseIndex].files.browse_url]
    : [this.selectedScene.browses[this.browseIndex], this.selectedScene.metadata.polygon];

    this.mapService.setSelectedBrowse(url, wkt);
  }

  private getBrowseCount() {
    return this.searchType === SearchType.SARVIEWS_EVENTS
    ? this.selectedEventProducts.length : this.selectedScene.browses.length;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
