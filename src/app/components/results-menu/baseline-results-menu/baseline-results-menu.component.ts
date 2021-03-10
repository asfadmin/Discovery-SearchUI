import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { Action, Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import { AsfApiOutputFormat, Breakpoints } from '@models';
import {ScreenSizeService, MapService, ScenesService, PairService} from '@services';

import { SubSink } from 'subsink';
import {map} from 'rxjs/operators';
import * as models from '@models';
import * as queueStore from '@store/queue';
import * as moment from 'moment';

enum CardViews {
  LIST = 0,
  DETAIL = 1
}

@Component({
  selector: 'app-baseline-results-menu',
  templateUrl: './baseline-results-menu.component.html',
  styleUrls: ['./baseline-results-menu.component.scss',  '../results-menu.component.scss']
})
export class BaselineResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;

  public numBaselineScenes$ = this.scenesService.scenes$().pipe(
    map(scenes => scenes.length),
  );

  public allProducts$ = this.scenesService.products$();

  public view = CardViews.LIST;
  public Views = CardViews;

  public searchType: models.SearchType;
  public SearchTypes = models.SearchType;
  public sbasProducts: models.CMRProduct[];
  public queuedProducts: models.CMRProduct[];

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private mapService: MapService,
    private scenesService: ScenesService,
    private pairService: PairService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        point => this.breakpoint = point
      )
    );

    this.subs.add(
      this.pairService.productsFromPairs$().subscribe(
        products => this.sbasProducts = products
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

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
  }

  public onSelectList(): void {
    this.view = CardViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = CardViews.DETAIL;
  }

  public queueAllProducts(products: models.CMRProduct[]): void {
    if (this.searchType === models.SearchType.CUSTOM_PRODUCTS) {
      products = this.downloadable(products);
    }

    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public slc(products: models.CMRProduct[]): models.CMRProduct[] {
    return products
      .filter(product => product.metadata.beamMode === 'IW')
      .filter(product => product.metadata.productType === 'SLC');
  }

  public grd(products: models.CMRProduct[]): models.CMRProduct[] {
    return products
      .filter(product => product.metadata.beamMode === 'IW')
      .filter(product => product.metadata.productType === 'GRD_HD');
  }

  public downloadable(products: models.CMRProduct[]): models.CMRProduct[] {
    return products.filter(product => this.isDownloadable(product));
  }

  public hyp3able(products: models.CMRProduct[]): models.CMRProduct[] {
    return products.filter(product => !product.metadata.polarization.includes('Dual'));
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

    private clearDispatchRestoreQueue(queueStoreAction: Action,  products: models.CMRProduct[], currentQueue: models.CMRProduct[]): void {
      this.store$.dispatch(new queueStore.ClearQueue());
      this.store$.dispatch(new queueStore.AddItems(products));
      this.store$.dispatch(queueStoreAction);

      this.store$.dispatch(new queueStore.ClearQueue());
      this.store$.dispatch(new queueStore.AddItems(currentQueue));
    }

    public onMakeDownloadScript(products: models.CMRProduct[]): void {
      const currentQueue = this.queuedProducts;
      this.clearDispatchRestoreQueue(new queueStore.MakeDownloadScript(), products, currentQueue);
    }

    public onCsvDownload(products: models.CMRProduct[]): void {
      const currentQueue = this.queuedProducts;
      this.clearDispatchRestoreQueue(new queueStore.DownloadMetadata(AsfApiOutputFormat.CSV), products, currentQueue);
    }

    public onKmlDownload(products: models.CMRProduct[]): void {
      const currentQueue = this.queuedProducts;
      this.clearDispatchRestoreQueue(new queueStore.DownloadMetadata(AsfApiOutputFormat.KML), products, currentQueue);
    }

    public onGeojsonDownload(products: models.CMRProduct[]): void {
      const currentQueue = this.queuedProducts;
      this.clearDispatchRestoreQueue(new queueStore.DownloadMetadata(AsfApiOutputFormat.GEOJSON), products, currentQueue);
    }

    public onMetalinkDownload(products: models.CMRProduct[]): void {
      const currentQueue = this.queuedProducts;
      this.clearDispatchRestoreQueue(new queueStore.DownloadMetadata(AsfApiOutputFormat.METALINK), products, currentQueue);
    }

    public queueAllOnDemand(products: models.CMRProduct[]): void {
      const jobs = this.hyp3able(products).map(
        product => ({
          granules: [ product ],
          job_type: models.Hyp3JobType.RTC_GAMMA
        })
      );
      this.store$.dispatch(new queueStore.AddJobs(jobs));
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
