import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';

import { Hyp3Service, SarviewsEventsService } from '@services';
import * as models from '@models';
import { SarviewsProduct } from '@models';


@Component({
  selector: 'app-scene-files',
  templateUrl: './scene-files.component.html',
  styleUrls: ['./scene-files.component.scss']
})
export class SceneFilesComponent implements OnInit, OnDestroy, AfterContentInit {
  public products: models.CMRProduct[];
  public productsByProductType: {[processing_type: string]: SarviewsProduct[]} = {};
  public sarviewsProducts: models.SarviewsProduct[];

  public queuedProductIds$ = this.store$.select(queueStore.getQueuedProductIds).pipe(
      map(names => new Set(names))
  );
  public selectedSarviewsEventID$ = this.store$.select(scenesStore.getSelectedSarviewsEvent).pipe(
      filter(event => !!event),
      map(event => event.event_id)
  );

  public sarviewsEventProducts$ = this.store$.select(scenesStore.getSelectedSarviewsEventProducts);

  public sarviewsEventProductTypes$ = this.sarviewsEventProducts$.pipe(
    map(products => {
      let selectedEventProductProcessingTypes = new Set<string>();
      products.forEach(product => selectedEventProductProcessingTypes.add(product.job_type));
      return Array.from(selectedEventProductProcessingTypes).sort();
    })
  )

  public sarviewsEventsProductsByProcessingType$ = this.sarviewsEventProducts$.pipe(
    filter(events => !!events),
    withLatestFrom(this.sarviewsEventProductTypes$),
    filter(([_, processing_types]) => !!processing_types),
    map(([eventProducts, processing_types]) => {
      let productsByProductType: {[processing_type: string]: SarviewsProduct[]} = {};
      processing_types.forEach(t => productsByProductType[t] = []);
      eventProducts.forEach(prod => productsByProductType[prod.job_type].push(prod));
      return productsByProductType;
    })
  );

  public areSarviewsEventsReady$ = this.sarviewsEventsProductsByProcessingType$.pipe(
    map(products => products !== null && products !== undefined)
  );

  public unzippedLoading: string;
  public loadingHyp3JobName: string | null;
  public validJobTypesByProduct: {[productId: string]: models.Hyp3JobType[]} = {};

  public showUnzippedProductScreen: boolean;
  public openUnzippedProduct: models.CMRProduct;
  public beforeWithUnzip: models.CMRProduct[] = [];
  public afterUnzip: models.CMRProduct[] = [];
  public unzippedProducts: {[id: string]: models.UnzippedFolder[]};
  public isUserLoggedIn: boolean;
  public hasAccessToRestrictedData: boolean;
  public showDemWarning: boolean;
  public selectedProducts: SarviewsProduct[];
  public selectedSarviewEventID: string;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private hyp3: Hyp3Service,
    private sarviewsService: SarviewsEventsService,
  ) { }

  ngOnInit() {
    this.subs.add(
      combineLatest(
        this.store$.select(scenesStore.getSelectedSceneProducts),
        this.store$.select(scenesStore.getOpenUnzippedProduct),
        this.store$.select(scenesStore.getUnzippedProducts)
      ).pipe(debounceTime(0))
      .subscribe(
        ([products, unzipped, unzippedFiles]) => {
          this.unzippedProducts = unzippedFiles;
          this.products = products;
          this.validJobTypesByProduct = {};
          this.products?.forEach(product => {
            this.validJobTypesByProduct[product.id] = this.hyp3.getValidJobTypes([product]);
          });
          this.openUnzippedProduct = unzipped;
          this.showDemWarning = this.demWarning(products);

          if (unzipped && products) {
            this.beforeWithUnzip = this.getBeforeWithUnzip(products);
            this.afterUnzip = this.getAfterUnzip(products);
          }
        }
      )
    );

    this.subs.add(
      this.sarviewsEventsProductsByProcessingType$.subscribe(
        val => this.productsByProductType = val
      )
    );

    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isUserLoggedIn = isLoggedIn
      )
    );
    this.subs.add(
      this.store$.select(userStore.getHasRestrictedDataAccess).subscribe(
        hasAccess => this.hasAccessToRestrictedData = hasAccess
      )
    );
    this.subs.add(
      this.store$.select(scenesStore.getShowUnzippedProduct).subscribe(
        showUnzipped => this.showUnzippedProductScreen = showUnzipped
      )
    );
    this.subs.add(
      this.store$.select(scenesStore.getUnzipLoading).subscribe(
        unzippedLoading => this.unzippedLoading = unzippedLoading
      )
    );
    this.subs.add(
      this.store$.select(hyp3Store.getSubmittingJobName).subscribe(
        jobName => this.loadingHyp3JobName = jobName
      )
    );
  }

  ngAfterContentInit() {
    this.subs.add(
      this.sarviewsEventProducts$.pipe(distinctUntilChanged((a, b) => a[0]?.event_id === b[0]?.event_id)).subscribe(
        val => this.sarviewsProducts = val
      )
    );

    this.subs.add(
      this.selectedSarviewsEventID$.subscribe(
        val => this.selectedSarviewEventID = val
      )
    )
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }

  public onOpenUnzipProduct(product: models.CMRProduct): void {
    if (this.unzippedProducts[product.id]) {
      this.store$.dispatch(new scenesStore.OpenUnzippedProduct(product));
    } else {
      this.store$.dispatch(new scenesStore.LoadUnzippedProduct(product));
    }
  }

  public onCloseProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new scenesStore.CloseZipContents(product));
  }

  public getBeforeWithUnzip(products: models.CMRProduct[]): models.CMRProduct[] {
    const pivotIdx = this.getPivotIdx(products);

    return products.slice(0, pivotIdx + 1);
  }

  public getAfterUnzip(products: models.CMRProduct[]): models.CMRProduct[] {
    const pivotIdx = this.getPivotIdx(products);

    return products.slice(pivotIdx + 1, products.length);
  }

  public getPivotIdx(products): number {
    let pivotIdx = 0;

    products.forEach((product, idx) => {
      if (this.openUnzippedProduct.id === product.id) {
        pivotIdx = idx;
      }
    });

    return pivotIdx;
  }

  public demWarning(products): boolean {
    let warn = false;

    if (!products) {
      return false;
    }

    products.forEach((product) => {
      if (product.dataset === 'ALOS' &&
          product.metadata.productType &&
          product.metadata.productType.includes('RTC_') ) {
        warn = true;
      }
    });

    return warn;
  }

  public onQueueHyp3Job(job: models.QueuedHyp3Job) {
    this.store$.dispatch(new queueStore.AddJob(job));
  }

  public formatProductName(product_name: string) {
    if(product_name.length > 18) {
      return product_name.slice(0, 29) + '...' + product_name.slice(product_name.length - 8);
    }
    return product_name;
  }

  // public onSarviewProductSelectionChange(current_id: string) {
  //   console.log(this.sarviewsService.getSarviewsEventPinnedUrl(current_id, this.selectedProducts));
  // }

  public downloadProduct(product_url: string) {
    window.open(product_url);
  }

  public currentPinnedUrl(current_id: string): string {
    if(!!current_id && !!this.selectedProducts) {
    return this.sarviewsService.getSarviewsEventPinnedUrl(current_id, this.selectedProducts);
    }
  }

  public onOpenPinnedProducts(current_id: string) {
    window.open(this.currentPinnedUrl(current_id));
  }

  public copyEventsOfType(type: string) {
    const products = this.productsByProductType[type];
    const granule_names = products.map(prod =>
      prod.granules.reduce((acc, granule_name) =>
        acc += granule_name.granule_name + ', ', ''));
    console.log(granule_names);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
