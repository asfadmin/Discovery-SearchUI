import { Component, OnDestroy, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

import { combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';

import {
  MapService, ScenesService, ScreenSizeService,
  PairService, Hyp3Service
} from '@services';
import * as models from '@models';
import { SubSink } from 'subsink';
import { AsfApiOutputFormat } from '@models';

@Component({
  selector: 'app-scenes-list-header',
  templateUrl: './scenes-list-header.component.html',
  styleUrls: ['./scenes-list-header.component.scss']
})
export class ScenesListHeaderComponent implements OnInit, OnDestroy {
  public totalResultCount$ = this.store$.select(searchStore.getTotalResultCount);
  public numberOfScenes$ = this.store$.select(scenesStore.getNumberOfScenes);
  public numberOfProducts$ = this.store$.select(scenesStore.getNumberOfProducts);
  public products;
  public numBaselineScenes$ = this.scenesService.scenes$().pipe(
    map(scenes => scenes.length),
  );
  public numPairs$ = this.pairService.pairs$().pipe(
    map(pairs => pairs.pairs.length + pairs.custom.length)
  );
  public pairs: models.CMRProductPair[];
  public sbasProducts: models.CMRProduct[];
  public queuedProducts: models.CMRProduct[];
  public canHideRawData: boolean;
  public showS1RawData: boolean;

  public canHideExpiredData: boolean;
  public showExpiredData: boolean;

  public temporalSort: models.ColumnSortDirection;
  public perpendicularSort: models.ColumnSortDirection;
  public SortDirection = models.ColumnSortDirection;

  public searchType: models.SearchType;
  public SearchTypes = models.SearchType;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  public RTC = models.hyp3JobTypes.RTC_GAMMA;
  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;

  public hyp3able = {};

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private scenesService: ScenesService,
    private pairService: PairService,
    private screenSize: ScreenSizeService,
    private hyp3: Hyp3Service,
  ) { }

  ngOnInit() {
    this.subs.add(
       this.pairService.productsFromPairs$().subscribe(
         products => this.sbasProducts = products
       )
    );

    this.subs.add(
      combineLatest(
        this.scenesService.products$(),
        this.pairService.pairs$()
      ).subscribe(
        ([products, {pairs, custom}]) => {
          this.products = products;
          this.pairs = [ ...pairs, ...custom ];

          this.hyp3able = this.hyp3.getHyp3ableProducts([
            ...this.products.map(prod => [prod]),
            ...this.pairs
          ]);
        }
      )
    );

    this.subs.add(
      combineLatest(
        this.scenesService.scenes$(),
        this.store$.select(filtersStore.getProductTypes),
        this.store$.select(searchStore.getSearchType),
      ).pipe(
        debounceTime(250)
      ).subscribe(([scenes, productTypes, searchType]) => {
        this.canHideRawData =
          searchType === models.SearchType.DATASET &&
          scenes.every(scene => scene.dataset === 'Sentinel-1B' || scene.dataset === 'Sentinel-1A') &&
          productTypes.length <= 0;
      })
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.canHideExpiredData = searchType === models.SearchType.CUSTOM_PRODUCTS
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getTemporalSortDirection).subscribe(
        temporalSort => this.temporalSort = temporalSort
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getPerpendicularSortDirection).subscribe(
        perpSort => this.perpendicularSort = perpSort
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getShowS1RawData).subscribe(
        showS1RawData => this.showS1RawData = showS1RawData
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getShowExpiredData).subscribe(
        showExpiredData => this.showExpiredData = showExpiredData
      )
    );

    this.subs.add(
      this.store$.select(queueStore.getQueuedProducts).subscribe(
        products => this.queuedProducts = products
        )
    );
  }

  public onZoomToResults(): void {
    this.mapService.zoomToResults();
  }

  public onToggleS1RawData(): void {
    this.store$.dispatch(
      this.showS1RawData ?
        new uiStore.HideS1RawData() :
        new uiStore.ShowS1RawData()
    );
  }

  public onToggleExpiredData(): void {
    this.store$.dispatch(
      this.showExpiredData ?
        new uiStore.HideExpiredData() :
        new uiStore.ShowExpiredData()
    );
  }

  public onTogglePerpendicularSort(): void {
    let direction: models.ColumnSortDirection;

    if (this.perpendicularSort === models.ColumnSortDirection.NONE) {
      direction = models.ColumnSortDirection.INCREASING;
    } else if (this.perpendicularSort === models.ColumnSortDirection.INCREASING) {
      direction = models.ColumnSortDirection.DECREASING;
    } else if (this.perpendicularSort === models.ColumnSortDirection.DECREASING) {
      direction = models.ColumnSortDirection.INCREASING;
    }

    this.store$.dispatch(new scenesStore.SetTemporalSortDirection(models.ColumnSortDirection.NONE));
    this.store$.dispatch(new scenesStore.SetPerpendicularSortDirection(direction));
  }

  public onToggleTemporalSort(): void {
    let direction: models.ColumnSortDirection;

    if (this.temporalSort === models.ColumnSortDirection.NONE) {
      direction = models.ColumnSortDirection.INCREASING;
    } else if (this.temporalSort === models.ColumnSortDirection.INCREASING) {
      direction = models.ColumnSortDirection.DECREASING;
    } else if (this.temporalSort === models.ColumnSortDirection.DECREASING) {
      direction = models.ColumnSortDirection.INCREASING;
    }

    this.store$.dispatch(new scenesStore.SetPerpendicularSortDirection(models.ColumnSortDirection.NONE));
    this.store$.dispatch(new scenesStore.SetTemporalSortDirection(direction));
  }

  public queueAllProducts(products: models.CMRProduct[]): void {
    if (this.searchType === models.SearchType.CUSTOM_PRODUCTS) {
      products = this.downloadable(products);
    }
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public downloadable(products: models.CMRProduct[]): models.CMRProduct[] {
    return products.filter(product => this.isDownloadable(product));
  }

  public queueSBASProducts(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onDownloadPairCSV() {
    const pairRows = this.pairs
      .map(([reference, secondary]) => {

        const temp = Math.abs(reference.metadata.temporal - secondary.metadata.temporal);

        return (
          `${reference.name},${reference.downloadUrl},${reference.metadata.perpendicular},` +
          `${secondary.name},${secondary.downloadUrl},${secondary.metadata.perpendicular},${temp}`
        );
      })
      .join('\n');

    const pairsCSV =
      `Reference, Reference URL, Reference Perpendicular Baseline (meters),` +
      `Secondary, Secondary URL, Secondary Perpendicular Baseline (meters),` +
      `Pair Temporal Baseline (days)\n${pairRows}`;

    const blob = new Blob([pairsCSV], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'asf-sbas-pairs.csv');
  }

  public formatNumber(num: number): string {
    return (num || 0)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return (
      !product.metadata.job ||
      (
        !this.isPending(product.metadata.job) &&
        !this.isFailed(product.metadata.job) &&
        !this.isRunning(product.metadata.job) &&
        !this.isExpired(product.metadata.job)
      )
    );
  }

  private clearDispatchRestoreQueue(outputFormat: AsfApiOutputFormat,
    products: models.CMRProduct[],
    currentQueue: models.CMRProduct[]): void {
    if (outputFormat === null) {
      this.store$.dispatch(new queueStore.ClearQueue());
      this.store$.dispatch(new queueStore.AddItems(products));
      this.store$.dispatch(new queueStore.MakeDownloadScript());

      this.store$.dispatch(new queueStore.ClearQueue());
      this.store$.dispatch(new queueStore.AddItems(currentQueue));
    } else if (this.searchType === this.SearchTypes.BASELINE) {
      this.store$.dispatch(new queueStore.DownloadSearchtypeMetadata(outputFormat));
    } else {
      this.store$.dispatch(new queueStore.ClearQueue());
      this.store$.dispatch(new queueStore.AddItems(products));
      this.store$.dispatch(new queueStore.DownloadMetadata(outputFormat));

      this.store$.dispatch(new queueStore.ClearQueue());
      this.store$.dispatch(new queueStore.AddItems(currentQueue));
    }
  }

  public onMakeDownloadScript(products: models.CMRProduct[]): void {
    const currentQueue = this.queuedProducts;
    this.clearDispatchRestoreQueue(null, products, currentQueue);
  }

  public onCsvDownload(products: models.CMRProduct[]): void {
    const currentQueue = this.queuedProducts;
    this.clearDispatchRestoreQueue(AsfApiOutputFormat.CSV, products, currentQueue);
  }

  public onKmlDownload(products: models.CMRProduct[]): void {
    const currentQueue = this.queuedProducts;
    this.clearDispatchRestoreQueue(AsfApiOutputFormat.KML, products, currentQueue);
  }

  public onGeojsonDownload(products: models.CMRProduct[]): void {
    const currentQueue = this.queuedProducts;
    this.clearDispatchRestoreQueue(AsfApiOutputFormat.GEOJSON, products, currentQueue);
  }

  public onMetalinkDownload(products: models.CMRProduct[]): void {
    const currentQueue = this.queuedProducts;
    this.clearDispatchRestoreQueue(AsfApiOutputFormat.METALINK, products, currentQueue);
  }

  public isExpired(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.SUCCEEDED &&
      this.expirationDays(job.expiration_time) <= 0;
  }

  public isFailed(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.FAILED;
  }

  public isPending(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.PENDING;
  }

  public isRunning(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.RUNNING;
  }

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
