import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { map, filter, tap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as userStore from '@store/user';

import * as models from '@models';
import { AuthService, BrowseOverlayService, MapService, PropertyService,
   SarviewsEventsService,
  ScreenSizeService } from '@services';
import { ImageDialogComponent } from './image-dialog';

import { DatasetForProductService } from '@services';
import { PinnedProduct } from '@services/browse-map.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scene-detail',
  templateUrl: './scene-detail.component.html',
  styleUrls: ['./scene-detail.component.scss'],
  providers: [ DatasetForProductService ]
})
export class SceneDetailComponent implements OnInit, OnDestroy {
  @Input() isScrollable = true;

  public scene: models.CMRProduct;
  public sarviewEvent: models.SarviewsEvent;
  public eventTypes = models.SarviewsEventType;
  public isActiveSarviewEvent = false;

  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);
  public jobBrowses$ = this.store$.select(scenesStore.getSelectedOnDemandProductSceneBrowses);
  public selectedSarviewsEventProducts$ = this.sarviewsService.filteredEventProducts$();

  public dataset: models.Dataset;
  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public isLoggedIn: boolean;
  public sceneLen: number;
  public p = models.Props;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isImageLoading = false;
  public selectedProducts: models.CMRProduct[];
  public selectedEventProducts: models.SarviewsProduct[];
  public eventSelectedProductIds: string[];
  public hasBaseline: boolean;
  public browseIndex = 0;
  public detailsOpen = true;
  public masterOffsets$ = this.store$.select(scenesStore.getMasterOffsets);
  public sarviewsEventGeoSearchRadius = 1.0;
  public asfWebsite = models.asfWebsite;

  private defaultBaselineFiltersID = '';
  private defaultSBASFiltersID = '';
  private dateRange: {start: Date | null, end: Date | null};

  public sarviewsProducts: models.SarviewsProduct[] = [];
  public isBrowseOverlayEnabled$: Observable<boolean> = this.browseOverlayService.isBrowseOverlayEnabled$;

  public isBrowseOverlayEnabled = false;

  private selectedSarviewsProductIndex$ = this.store$.select(scenesStore.getSelectedSarviewsProduct).pipe(
    filter(product => !!product),
    withLatestFrom(this.selectedSarviewsEventProducts$),
    map(([product, products]) => products.findIndex(prod => prod.product_id === product.product_id))
  );

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public dialog: MatDialog,
    public authService: AuthService,
    public prop: PropertyService,
    private datasetForProduct: DatasetForProductService,
    private sarviewsService: SarviewsEventsService,
    private mapService: MapService,
    private browseOverlayService: BrowseOverlayService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.isBrowseOverlayEnabled$.subscribe(
        enabled => this.isBrowseOverlayEnabled = enabled
      )
    );

    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getPinnedEventBrowseIDs).subscribe(
        ids => this.eventSelectedProductIds = ids
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getDateRange).subscribe(
        r => this.dateRange = r
      )
    );

    this.subs.add(
      this.screenSize.size$.pipe(
        map(size => size.width > 1750 ? 32 : 16),
      ).subscribe(len => this.sceneLen = len)
    );

    const scene$ = this.store$.select(scenesStore.getSelectedScene).pipe(
      distinctUntilChanged((previous, current) => previous?.id === current?.id),
      tap(_ => this.isImageLoading = true)
    );

    const sarviewsEvent$ = this.store$.select(scenesStore.getSelectedSarviewsEvent).pipe(
      tap(_ => this.browseIndex = 0),
      filter(selectedEvent => !!selectedEvent));


    this.subs.add(
      sarviewsEvent$.subscribe(event => {
          this.sarviewEvent = event;
          if (event.processing_timeframe) {
            if (event.processing_timeframe.end?.getDay() === new Date().getDay() || !event.processing_timeframe.end) {
              this.isActiveSarviewEvent = true;
            } else {
              this.isActiveSarviewEvent = false;
            }
          }
          this.mapService.onSetSarviewsPolygon(event, this.sarviewsEventGeoSearchRadius);
          }
        )
    );
    this.subs.add(
      scene$.pipe(
        tap(scene => this.scene = scene),
        filter(scene => !!scene),
        map(scene => this.datasetForProduct.match(scene)),
        tap(dataset => this.dataset = dataset),
      ).subscribe(_ => this.updateHasBaseline())
    );

    this.subs.add(
      this.store$.select(scenesStore.getSelectedSceneProducts).pipe(
        tap(products => this.selectedProducts = products),
      ).subscribe(_ => {
        this.updateHasBaseline();
        this.browseIndex = 0;
      })
    );

    this.subs.add(
      this.selectedSarviewsEventProducts$
      .pipe(filter(eventProducts => !!eventProducts))
      .subscribe(
          selectedEventProducts => this.selectedEventProducts = selectedEventProducts
        )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserProfile).pipe(
        filter(profile => !!profile),
        map(profile => profile.defaultFilterPresets),
        filter(defaultFilterPresets => !!defaultFilterPresets),
        ).subscribe(
        profile => {
          this.defaultBaselineFiltersID = profile['Baseline Search'];
          this.defaultSBASFiltersID = profile['SBAS Search'];
        }
      )
    );

    this.subs.add(
      this.selectedSarviewsEventProducts$.subscribe(
        browses => this.sarviewsProducts = browses
      )
    );

    this.subs.add(
      this.selectedSarviewsProductIndex$.subscribe(
        idx => this.onUpdateBrowseIndex(idx)
      )
    );

  }

  public updateHasBaseline(): void {
    this.hasBaseline = (
      this.prop.isRelevant(this.p.BASELINE_TOOL, this.dataset) &&
      !!this.selectedProducts &&
      this.sceneCanInSAR() &&
      this.hasBaselineProductType()
    );
  }

  public sceneCanInSAR(): boolean {
    return this.dataset.id === models.sentinel_1.id ? true : this.selectedProducts
      .map(product => product.metadata.canInSAR)
      .some(canInSAR => !!canInSAR);
  }

  public baselineSceneName(): string {
    if (!this.scene) {
      return '';
    }

    if (this.dataset.id === models.sentinel_1.id) {
      return this.selectedProducts.filter(
          product => product.metadata.productType === 'SLC' || product.metadata.productType === 'BURST'
      )[0].name;
    } else {
      return this.scene.name;
    }
  }

  public sceneHasBrowse() {
    return (
      !!this.scene.browses &&
      this.scene.browses.length > 0 &&
      !this.scene?.browses[0].includes('no-browse')
    );
  }

  public productHasSceneBrowses() {
    if (this.searchType === this.searchTypes.CUSTOM_PRODUCTS) {
      return this.scene.metadata.job.job_parameters.scenes.some(x => !x.browses[0].includes('no-browse'));
    }
    return false;
  }

  public sarviewsEventHasSceneBrowses() {
    if (this.searchType === this.searchTypes.SARVIEWS_EVENTS) {
      return this.sarviewsProducts?.length > 0;
    }
    return false;
  }

  public hasBaselineProductType(): boolean {
    if (this.dataset.id === 'ALOS') {
      return false;
    }
    if (!this.selectedProducts || this.dataset.id !== models.sentinel_1.id) {
      return true;
    } else {
      return this.selectedProducts
        .map(product => product.metadata.productType)
        .filter(productType => productType === 'SLC' || productType === 'BURST')
        .length > 0;
    }
  }

  public onOpenImage(): void {
    if (this.searchType === models.SearchType.SARVIEWS_EVENTS) {
      this.store$.dispatch(new scenesStore.SetSelectedSarviewProduct(this.sarviewsProducts[this.browseIndex]));
    } else if (!this.sceneHasBrowse()) {
      return;
    }

    this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(true));

    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '99%',
      maxWidth: '99%',
      height: '99%',
      maxHeight: '99%',
      panelClass: 'image-dialog'
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(
        _ => this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(false))
      )
    );
  }

  public onIncrementBrowseIndex() {
    if (this.browseIndex === this.getBrowseCount() - 1) {
      return;
    }
    const newIndex = this.browseIndex + 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onDecrementBrowseIndex() {
    if (this.browseIndex === 0) {
      return;
    }
    const newIndex = this.browseIndex - 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onUpdateBrowseIndex(newIndex: number) {
    if (!this.isBrowseOverlayEnabled) {
      return;
    }

    this.browseIndex = newIndex;
    const [url, wkt] = this.searchType === this.searchTypes.SARVIEWS_EVENTS
    ? [this.selectedEventProducts[this.browseIndex].files.browse_url, this.selectedEventProducts[this.browseIndex]?.granules[0].wkt]
    : [this.scene.browses[this.browseIndex], this.scene.metadata.polygon];

    this.mapService.setSelectedBrowse(url, wkt);
  }

  public onToggleSarviewsProductPin() {
    if (this.selectedEventProducts?.length === 0) {
      return;
    }

    const currentProductId = this.selectedEventProducts[this.browseIndex].product_id;
    const isPinned = this.eventSelectedProductIds.includes(currentProductId);

    if (isPinned) {
      this.eventSelectedProductIds = this.eventSelectedProductIds.filter(productId => productId !== currentProductId);
    } else {
      this.eventSelectedProductIds.push(currentProductId);
    }
    this.onUpdatePinnedUrl(this.eventSelectedProductIds);
  }

  public onUpdatePinnedUrl(selectedProducts: string[]) {
    const pinned = selectedProducts.reduce(
      (prev, key) => {
        const output = {} as PinnedProduct;
        const sarviewsProduct = this.sarviewsProducts.find(prod => prod.product_id === key);
        output.url = sarviewsProduct.files.browse_url;
        output.wkt = sarviewsProduct.granules[0].wkt;

        prev[key] = output;
        return prev;
      }, {} as {[product_id in string]: PinnedProduct}
    );

    this.store$.dispatch(new scenesStore.SetImageBrowseProducts(pinned));
  }

  public onSetSelectedAsMaster() {
    this.store$.dispatch(new scenesStore.SetMaster(this.scene.name));
  }

  public moreLikeThis(): void {
    if (this.searchType === models.SearchType.SARVIEWS_EVENTS) {
      this.makeSarviewsEventGeoSearch();
    } else {
      const scene = this.scene;
      const shouldClear = this.searchType !== models.SearchType.DATASET || this.dataset.id === 'OPERA-S1';
      const dateRange = this.dateRange;

      this.store$.dispatch(new searchStore.SetSearchType(models.SearchType.DATASET));

      if (shouldClear) {
        this.store$.dispatch(new searchStore.ClearSearch());
      }

      this.store$.dispatch(new filtersStore.SetFiltersSimilarTo({product: scene, dataset: this.datasetForProduct.match(scene)}));

      if (!!dateRange.start) {
        this.store$.dispatch(new filtersStore.SetStartDate(new Date(dateRange.start)));
      }
      if (!!dateRange.end) {
        this.store$.dispatch(new filtersStore.SetEndDate(new Date(dateRange.end)));
      }

      this.store$.dispatch(new searchStore.MakeSearch());
    }
  }

  public staticLayer(){
    const operaBurstID = this.scene.metadata.opera.operaBurstID;
    const sensorDate = new Date(this.scene.metadata.date.toDate());
    const staticType = this.scene.metadata.productType + '-STATIC'
    this.store$.dispatch(new searchStore.ClearSearch());
    this.store$.dispatch(new filtersStore.SetSelectedDataset('OPERA-S1'))
    this.store$.dispatch(new filtersStore.setOperaBurstID([operaBurstID]));
    this.store$.dispatch(new filtersStore.SetProductTypes([models.opera_s1.productTypes.find(t => t.apiValue === staticType)]));
    this.store$.dispatch(new filtersStore.SetEndDate(sensorDate));
    this.store$.dispatch(new searchStore.MakeSearch());
  }
  public makeBaselineSearch(): void {
    const sceneName = this.baselineSceneName();
    const dateRange = this.dateRange;

    [
      new searchStore.SetSearchType(models.SearchType.BASELINE),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultBaselineFiltersID),
      new scenesStore.SetFilterMaster(sceneName),
    ].forEach(action => this.store$.dispatch(action));

    if (!!dateRange.start) {
      this.store$.dispatch(new filtersStore.SetStartDate(new Date(dateRange.start)));
    }
    if (!!dateRange.end) {
      this.store$.dispatch(new filtersStore.SetEndDate(new Date(dateRange.end)));
    }

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public makeSBASSearch(): void {
    const sceneName = this.baselineSceneName();
    const dateRange = this.dateRange;

    [
      new searchStore.SetSearchType(models.SearchType.SBAS),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultSBASFiltersID),
      new scenesStore.SetFilterMaster(sceneName),
    ].forEach(action => this.store$.dispatch(action));

    if (!!dateRange.start) {
      this.store$.dispatch(new filtersStore.SetStartDate(new Date(dateRange.start)));
    }
    if (!!dateRange.end) {
      this.store$.dispatch(new filtersStore.SetEndDate(new Date(dateRange.end)));
    }

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public onSetDetailsOpen(event: Event) {
    this.detailsOpen = (event.target as HTMLDetailsElement).open;
  }

  public isRestrictedDataset(): boolean {
    return (
      this.scene.dataset.includes('JERS-1')
    );
  }

  public getEventID() {
    if (this.sarviewEvent.event_type === 'quake') {
      return (this.sarviewEvent as models.SarviewsQuakeEvent).usgs_event_id;
    }

    return (this.sarviewEvent as models.SarviewsVolcanicEvent).smithsonian_event_id;
  }

  public makeSarviewsEventGeoSearch() {
    const timeFrame = this.sarviewEvent.processing_timeframe;
    const event = this.sarviewEvent;
    [
      new searchStore.SetSearchType(models.SearchType.DATASET),
      new searchStore.ClearSearch(),
      new filtersStore.SetSelectedDataset('SENTINEL-1'),
    ].forEach(action => this.store$.dispatch(action));

    if (!!timeFrame.start) {
      this.store$.dispatch(new filtersStore.SetStartDate(new Date(timeFrame.start)));
    }
    if (!!timeFrame.end) {
      this.store$.dispatch(new filtersStore.SetEndDate(new Date(timeFrame.end)));
    }
    this.mapService.onSetSarviewsPolygon(event, this.sarviewsEventGeoSearchRadius);

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public onEventSearchRadiusChange(value: number) {
    this.sarviewsEventGeoSearchRadius = value;
  }

  public makeEventListSearch() {
    const product_ids = this.sarviewsProducts.map(product => product.granules[0].granule_name);

    [
      new searchStore.SetSearchType(models.SearchType.LIST),
      new searchStore.ClearSearch(),
      new filtersStore.SetSearchList(product_ids),
    ].forEach(action => this.store$.dispatch(action));

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  private getBrowseCount() {
    return this.searchType === this.searchTypes.SARVIEWS_EVENTS
    ? this.selectedEventProducts.length : this.scene.browses.length;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
