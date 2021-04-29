import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';

import { Hyp3Service } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-scene-files',
  templateUrl: './scene-files.component.html',
  styleUrls: ['./scene-files.component.scss']
})
export class SceneFilesComponent implements OnInit, OnDestroy {
  public products: models.CMRProduct[];
  public queuedProductIds$ = this.store$.select(queueStore.getQueuedProductIds).pipe(
      map(names => new Set(names))
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
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private hyp3: Hyp3Service,
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
          this.products.forEach(product => {
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
