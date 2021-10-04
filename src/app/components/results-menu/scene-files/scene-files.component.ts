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

import { Hyp3Service, NotificationService, SarviewsEventsService } from '@services';
import * as models from '@models';
import { CMRProductMetadata, hyp3JobTypes, SarviewProductGranule, SarviewsProduct } from '@models';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment';

import { faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scene-files',
  templateUrl: './scene-files.component.html',
  styleUrls: ['./scene-files.component.scss']
})
export class SceneFilesComponent implements OnInit, OnDestroy, AfterContentInit {
  public copyIcon = faCopy;
  public products: models.CMRProduct[];
  public productsByProductType: {[processing_type: string]: SarviewsProduct[]} = {};
  public selectedProducts: { [product_id in string]: boolean} = {};
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
      const selectedEventProductProcessingTypes = new Set<string>();
      products.forEach(product => selectedEventProductProcessingTypes.add(product.job_type));
      return Array.from(selectedEventProductProcessingTypes).sort();
    })
  );

  public sarviewsEventsProductsByProcessingType$ = this.sarviewsEventProducts$.pipe(
    filter(events => !!events),
    withLatestFrom(this.sarviewsEventProductTypes$),
    filter(([_, processing_types]) => !!processing_types),
    map(([eventProducts, processing_types]) => {
      const productsByProductType: {[processing_type: string]: SarviewsProduct[]} = {};
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
  // public selectedProducts: SarviewsProduct[] = [];
  public selectedSarviewEventID: string;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private hyp3: Hyp3Service,
    private sarviewsService: SarviewsEventsService,
    private clipboard: ClipboardService,
    private notificationService: NotificationService,
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
        val => {
          this.sarviewsProducts = val;
          this.selectedProducts = val.map(product => product.product_id).reduce((prev, curr) => {
            prev[curr] = false;
            return prev;
          }, {} as {[product_id in string]: boolean});
        }
      )
    );

    this.subs.add(
      this.selectedSarviewsEventID$.subscribe(
        val => this.selectedSarviewEventID = val
      )
    );
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
    if (product_name.length > 18) {
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
    const product_ids = Object.keys(this.selectedProducts).filter(
      product_ids => !!this.selectedProducts?.[product_ids]
    );
    // if(!!current_id && !!this.selectedProducts) {
    return this.sarviewsService.getSarviewsEventPinnedUrl(current_id, product_ids);
    // }
  }

  public onSelectSarviewsProduct(product_id: string) {
    this.selectedProducts[product_id] = !this.selectedProducts?.[product_id] ?? true;
  }

  public onOpenPinnedProducts(current_id: string) {
    window.open(this.currentPinnedUrl(current_id));
  }

  public copyProductSourceScenes() {
    const products = this.sarviewsProducts;
    const granule_name_list = products.reduce(
      (acc, curr) => acc = acc.concat(curr.granules), [] as SarviewProductGranule[]
      ).map(gran => gran.granule_name);

    this.clipboard.copyFromContent( granule_name_list.join(','));
    this.notificationService.info(`Scene Names Copied`);
  }

  public onQueueSarviewsProduct(product: models.SarviewsProduct): void {
    const jobTypes = Object.values(hyp3JobTypes);
    const jobType = jobTypes.find(t => t.id === product.job_type);


      const productTypeDisplay = `${jobType.name}, ${jobType.productTypes[0].productTypes[0]}`;
      const toCMRProduct: models.CMRProduct = {
        name: product.files.product_name,
        productTypeDisplay,
        file: '',
        id: product.product_id,
        downloadUrl: product.files.product_url,
        bytes: product.files.product_size,
        browses: [product.files.browse_url],
        thumbnail: product.files.thumbnail_url,
        dataset: 'Sentinel-1',
        groupId: 'SARViews',
        isUnzippedFile: false,

        metadata: {
          date: moment(product.processing_date),
          stopDate: moment(product.processing_date),
          polygon: product.granules[0].wkt,
          productType: jobType.name,

        } as CMRProductMetadata


      };

    this.store$.dispatch(new queueStore.AddItems([toCMRProduct]));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
