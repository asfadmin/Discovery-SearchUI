import {Component, OnInit, OnDestroy, AfterContentInit, Input, ViewChild} from '@angular/core';
import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { debounceTime, filter, map, take, withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';
import * as uiStore from '@store/ui';

import { Hyp3Service, NotificationService, SarviewsEventsService } from '@services';
import * as models from '@models';
import { CMRProductMetadata, hyp3JobTypes, SarviewProductGranule, SarviewsProduct } from '@models';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { MatSelectionListChange } from '@angular/material/list';
import { PinnedProduct } from '@services/browse-map.service';
import { ImageDialogComponent } from '../scene-detail/image-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ScreenSizeService } from '@services';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-scene-files',
  templateUrl: './scene-files.component.html',
  styleUrls: ['./scene-files.component.scss']
})
export class SceneFilesComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild(CdkVirtualScrollViewport, {static: false}) scrollPort: CdkVirtualScrollViewport;
  @Input() isScrollable = true;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public copyIcon = faCopy;
  public products: models.CMRProduct[];
  public productsByProductType: {[processing_type: string]: SarviewsProduct[]} = {};
  public selectedProducts: string[];
  public sarviewsProducts: models.SarviewsProduct[];
  public queuedProductIds: string[];
  public hyp3ableByProduct: {};

  public queuedProductIds$ = this.store$.select(queueStore.getQueuedProductIds).pipe(
      map(names => new Set(names))
  );

  public selectedSarviewsEventID$ = this.store$.select(scenesStore.getSelectedSarviewsEvent).pipe(
      filter(event => !!event),
      map(event => event.event_id)
  );

  public sarviewsEventProducts$ = this.eventMonitoringService.filteredEventProducts$();

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
  public selectedSarviewsProducts: SarviewsProduct[] = [];
  public selectedSarviewEventID: string;
  private subs = new SubSink();

  private selectedSarviewsProductIndex$ = this.store$.select(scenesStore.getSelectedSarviewsProduct).pipe(
    filter(product => !!product),
    withLatestFrom(this.sarviewsEventProducts$),
    map(([product, products]) => products.findIndex(prod => prod.product_id === product.product_id))
  );

  constructor(
    private store$: Store<AppState>,
    private hyp3: Hyp3Service,
    private clipboard: ClipboardService,
    private notificationService: NotificationService,
    private eventMonitoringService: SarviewsEventsService,
    public dialog: MatDialog,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit() {
    this.subs.add(
      combineLatest([
        this.store$.select(scenesStore.getSelectedSceneProducts),
        this.store$.select(scenesStore.getOpenUnzippedProduct),
        this.store$.select(scenesStore.getUnzippedProducts)]
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
      this.queuedProductIds$.subscribe(
        ids => this.queuedProductIds = Array.from(ids)
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
      this.sarviewsEventProducts$.subscribe(
        products => {
          this.sarviewsProducts = products;
          this.hyp3ableByProduct = this.sarviewsProducts.reduce((prev, curr) => prev = {
            ...prev,
            [curr.product_id]: [this.eventMonitoringService.hyp3able(curr)]
          }, {});
        }
      ));

    this.subs.add(
      this.store$.select(scenesStore.getPinnedEventBrowseIDs).subscribe(
        ids => this.selectedProducts = ids
      )
    );

    this.subs.add(
      this.selectedSarviewsEventID$.subscribe(
        val => this.selectedSarviewEventID = val
      )
    );

    this.subs.add(
      this.selectedSarviewsProductIndex$.subscribe(
        idx => this.scrollPort.scrollToIndex(idx)
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

  public formatProductName(product_name: string, desiredLen?: number) {
    const extrasWidthPx = 260;
    const charWidthPx = 10;
    const divWidthPx = document.getElementById('event-selection-list').offsetWidth;
    const defaultLen = Math.trunc((divWidthPx - extrasWidthPx) / charWidthPx);
    desiredLen = desiredLen ? desiredLen : defaultLen;
    desiredLen = desiredLen < 15 ? 15 : desiredLen;
    const tailLen = 8;
    const pNameLen = product_name.length;
    if (pNameLen > desiredLen) {
      return product_name.slice(0, desiredLen - tailLen - 1) +
        '...' +
        product_name.slice(pNameLen - tailLen);
    }
    return product_name;
  }

  public downloadProduct(_product_url) {
    // window.open(product_url);
  }

  public onSelectSarviewsProduct(selections: MatSelectionListChange) {
    const deselected = selections.options.filter(option => !option.selected)
      .map(option => option.value as string);

    const selected = selections.options.filter(option => option.selected)
      .map(option => option.value as string);

    this.selectedProducts = this.selectedProducts.filter(product => !deselected.includes(product));
    this.selectedProducts = Array.from(new Set<string>(this.selectedProducts.concat(selected)));
    this.onUpdatePinnedUrl(this.selectedProducts);
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

  public onOpenPinnedProducts() {
    this.store$.dispatch(new scenesStore.SetSelectedSarviewProduct(this.sarviewsProducts[0]));

    this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(true));

    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '99%',
      maxWidth: '99%',
      height: '99%',
      maxHeight: '99%',
      panelClass: 'image-dialog'
    });

    this.subs.add(
      dialogRef.afterClosed().pipe(take(1)).subscribe(
        _ => this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(false))
      )
    );
  }

  public copyProductSourceScenes(products: SarviewsProduct[]) {
    const granuleNameList = products.reduce(
      (acc, curr) => acc = acc.concat(curr.granules), [] as SarviewProductGranule[]
      ).map(gran => gran.granule_name);
    const granuleNameListSet = new Set(granuleNameList);

    this.clipboard.copyFromContent( Array.from(granuleNameListSet).join(','));
    this.notificationService.clipboardCopyIcon('', granuleNameListSet.size);
  }

  public onQueueSarviewsProduct(product: models.SarviewsProduct): void {
    const jobTypes = Object.values(hyp3JobTypes);
    const jobType = jobTypes.find(t => t.id === product.job_type);


      const productTypeDisplay = `${jobType.name}, ${jobType.productTypes[0].productTypes[0]}`;
      const toCMRProduct: models.CMRProduct = {
        name: product.files.product_name,
        productTypeDisplay,
        file: product.files.product_name,
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

    if (this.queuedProductIds.includes(product.product_id)) {
      this.store$.dispatch(new queueStore.RemoveItems([toCMRProduct]));
    } else {
      this.store$.dispatch(new queueStore.AddItems([toCMRProduct]));
    }
  }
  public getCMRProductSarviews(product: models.SarviewsProduct) {

    const jobTypes = Object.values(hyp3JobTypes);
    const jobType = jobTypes.find(t => t.id === product.job_type);
    const productTypeDisplay = `${jobType.name}, ${jobType.productTypes[0].productTypes[0]}`;

    const toCMRProduct: models.CMRProduct = {
      name: product.files.product_name,
      productTypeDisplay,
      file: product.files.product_name,
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
    return toCMRProduct;
  }
  public getProductSceneCount(products: SarviewsProduct[]) {
    const outputList = products.reduce((prev, product) => {
        const temp = product.granules.map(granule => granule.granule_name);

        prev = prev.concat(temp);

        return prev;

        }, [] as string[]
    );

    return new Set(outputList).size;
  }

  public getProductDownloadUrl(products: SarviewsProduct[]) {
    const productListStr = products.map(product => product.files.product_url);
    this.clipboard.copyFromContent( productListStr.join('\n '));
    const lines = products.length;
    this.notificationService.clipboardCopyQueue(lines, false);
  }

  public onAddEventToOnDemand(product: SarviewsProduct) {
    const job: models.QueuedHyp3Job = {
      granules:  this.eventMonitoringService.getSourceCMRProducts(product),
      job_type: hyp3JobTypes[product.job_type]
      };

    this.store$.dispatch(new queueStore.AddJob(job));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
