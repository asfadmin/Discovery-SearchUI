import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { map, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as userStore from '@store/user';

import * as models from '@models';
import { AuthService, MapService, PropertyService,
   SarviewsEventsService,
  ScreenSizeService } from '@services';
import { ImageDialogComponent } from './image-dialog';

import { DatasetForProductService } from '@services';

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
  public selectedSarviewsEventProducts$ = this.store$.select(scenesStore.getSelectedSarviewsEventProducts);
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
  public hasBaseline: boolean;
  public browseIndex = 0;
  public detailsOpen = true;
  public masterOffsets$ = this.store$.select(scenesStore.getMasterOffsets);
  public sarviewsEventGeoSearchRadius = 1.0;

  private defaultBaselineFiltersID = '';
  private defaultSBASFiltersID = '';

  public sarviewsProducts: models.SarviewsProduct[] = [];

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
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );


    this.subs.add(
      this.screenSize.size$.pipe(
        map(size => size.width > 1750 ? 32 : 16),
      ).subscribe(len => this.sceneLen = len)
    );

    const scene$ = this.store$.select(scenesStore.getSelectedScene).pipe(
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
          product => product.metadata.productType === 'SLC'
      )[0].name;
    } else {
      return this.scene.name;
    }
  }

  public sceneHasBrowse() {
    return !this.scene?.browses[0].includes('no-browse');
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
    if (!this.selectedProducts || this.dataset.id !== models.sentinel_1.id) {
      return true;
    } else {
      return this.selectedProducts
        .map(product => product.metadata.productType)
        .filter(productType => productType === 'SLC')
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

  public onSetSelectedAsMaster() {
    this.store$.dispatch(new scenesStore.SetMaster(this.scene.name));
  }

  public findSimilarScenes(): void {
    if (this.searchType === models.SearchType.SARVIEWS_EVENTS) {
      this.makeSarviewsEventGeoSearch();
    } else {
    const scene = this.scene;
    const shouldClear = this.searchType !== models.SearchType.DATASET;
    this.store$.dispatch(new searchStore.SetSearchType(models.SearchType.DATASET));

    if (shouldClear) {
      this.store$.dispatch(new searchStore.ClearSearch());
    }
    this.store$.dispatch(new filtersStore.SetFiltersSimilarTo({product: scene, dataset: this.datasetForProduct.match(scene)}));
    this.store$.dispatch(new searchStore.MakeSearch());
  }
  }

  public makeBaselineSearch(): void {
    const sceneName = this.baselineSceneName();
    [
      new searchStore.SetSearchType(models.SearchType.BASELINE),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultBaselineFiltersID),
      new scenesStore.SetFilterMaster(sceneName),
      new searchStore.MakeSearch()
    ].forEach(action => this.store$.dispatch(action));
  }

  public makeSBASSearch(): void {
    const sceneName = this.baselineSceneName();

    [
      new searchStore.SetSearchType(models.SearchType.SBAS),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultSBASFiltersID),
      new scenesStore.SetFilterMaster(sceneName),
      new searchStore.MakeSearch()
    ].forEach(action => this.store$.dispatch(action));
  }

  public onSetDetailsOpen(event: Event) {
    this.detailsOpen = (event.target as HTMLDetailsElement).open;
  }

  public isRestrictedDataset(): boolean {
    return (
      this.scene.dataset.includes('RADARSAT-1') ||
      this.scene.dataset.includes('JERS-1')
    );
  }

  public getSarviewsURL() {
    return this.sarviewsService.getSarviewsEventUrl(this.sarviewEvent?.event_id ?? '');
  }

  public getEventID() {
    if (this.sarviewEvent.event_type === 'quake') {
      return (this.sarviewEvent as models.SarviewsQuakeEvent).usgs_event_id;
    }

    return (this.sarviewEvent as models.SarviewsVolcanicEvent).smithsonian_event_id;
  }

  public makeSarviewsEventGeoSearch() {
    const timeFrame = this.sarviewEvent.processing_timeframe;

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
    this.mapService.onSetSarviewsPolygon(this.sarviewEvent, this.sarviewsEventGeoSearchRadius);

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public onEventSearchRadiusChange(value: number) {
    this.sarviewsEventGeoSearchRadius = value;
    // this.mapService.onSetSarviewsPolygon(this.sarviewEvent, this.sarviewsEventGeoSearchRadius);
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

  public openInSarviews() {
    window.open(this.getSarviewsURL());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
