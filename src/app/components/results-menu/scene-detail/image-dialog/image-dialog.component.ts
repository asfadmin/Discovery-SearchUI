import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import { filter, map, tap, debounceTime, first,
  // distinctUntilChanged,
  delay, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import * as models from '@models';
import { BrowseMapService, DatasetForProductService, SarviewsEventsService } from '@services';
import * as services from '@services/index';
import {
  // Breakpoints,
  SarviewProductGranule, SarviewsProduct } from '@models';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
  providers: [ BrowseMapService ]
})
export class ImageDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  public scene$ = this.store$.select(scenesStore.getSelectedScene);
  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);
  public sarviewsEventProducts$ = this.sarviewsService.filteredEventProducts$();
  public sarviewsEventBrowses$ = this.store$.select(scenesStore.getSelectedSarviewsEventProductBrowses);
  public sarviewsEvent$ = this.store$.select(scenesStore.getSelectedSarviewsEvent);
  public masterOffsets$ = this.store$.select(scenesStore.getMasterOffsets);
  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public onlyShowScenesWithBrowse: boolean;
  public queuedProductIds: Set<string>;
  public scene: models.CMRProduct;
  public sarviewsEvent: models.SarviewsEvent;
  public eventType: models.SarviewsEventType;
  public currentSarviewsProduct: models.SarviewsProduct;
  public products: models.CMRProduct[];
  public sarviewsProducts: models.SarviewsProduct[];
  public dataset: models.Dataset;
  public isImageLoading = false;
  public isShow = false;
  public currentBrowse = null;
  public paramsList: any;
  public currentSarviewsCMRProduct: models.CMRProduct;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public breakpoint: models.Breakpoints = models.Breakpoints.FULL;

  private image: HTMLImageElement = new Image();
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    private browseMap: BrowseMapService,
    private datasetForProduct: DatasetForProductService,
    private screenSize: services.ScreenSizeService,
    private clipboard: ClipboardService,
    private notificationService: services.NotificationService,
    private sarviewsService: SarviewsEventsService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );
    this.subs.add(
      this.store$.select(scenesStore.getSelectedSceneProducts).subscribe(
        products => {
          this.products = products;
        }
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getOnlyScenesWithBrowse).subscribe(
        onlyBrowses => this.onlyShowScenesWithBrowse = onlyBrowses
      )
    );

    this.subs.add(
      this.store$.select(queueStore.getQueuedProductIds).pipe(
        map(names => new Set(names))
      ).subscribe(queuedProducts => this.queuedProductIds = queuedProducts)
    );

    this.subs.add(
      this.scene$.pipe(
        filter(g => !!g),
        tap(g => this.scene = g),
        map(scene => this.datasetForProduct.match(scene)),
      ).subscribe(dataset => this.dataset = dataset)
    );
    this.subs.add(
      this.scene$.pipe(
        filter(prod => !!prod?.metadata)
      ).subscribe( prod => {
        this.paramsList = this.jobParamsToList(prod.metadata);
      }
    )
    );

    this.subs.add(
      this.sarviewsEvent$.pipe(
        filter(event => !!event),
      ).subscribe(
        event => {
          this.sarviewsEvent = event;
          this.eventType = event.event_type === 'quake' ? models.SarviewsEventType.QUAKE : models.SarviewsEventType.VOLCANO;
        }
      )
    );
    this.subs.add(
      this.store$.select(scenesStore.getSelectedSarviewsProduct).pipe(
        delay(100),
      ).subscribe(
        product => {
          if (!!product) {
            this.onNewSarviewsBrowseSelected(product);
          }
        }
      )
    );
  }

  ngAfterViewInit() {
    this.subs.add(
      this.scene$.pipe(
        filter(scene => !!scene),
        debounceTime(250)
      ).subscribe(
        scene => {
          this.currentBrowse = scene.browses[0];
          this.loadBrowseImage(scene, this.currentBrowse);
        }
      )
    );
    this.subs.add(
      this.sarviewsEventProducts$.pipe(
        withLatestFrom(this.searchType$),
        filter(([_, searchtype]) => searchtype === models.SearchType.SARVIEWS_EVENTS),
        map(([products, _]) => products),
        filter(products => !!products),
        filter(products => products.length > 0),
        debounceTime(500),
        first(),
      ).subscribe(
        products => {
          if (!this.currentSarviewsProduct) {
            this.currentBrowse = products[0].files.product_url;
            this.loadSarviewsBrowseImage(products[0]);
          }
        }
      )
    );
  }

  private loadBrowseImage(scene: models.CMRProduct, browse): void {
    this.isImageLoading = true;
    this.image = new Image();
    const browseService = this.browseMap;
    const currentScene = this.scene;
    const self = this;

    this.image.addEventListener('load', function() {
      if (currentScene !== scene) {
        return;
      }

      self.isImageLoading = false;

      // const wkt = scene.metadata.polygon;
      const [width, height] = [
        this.naturalWidth, this.naturalHeight
      ];
      browseService.setBrowse(browse, {width,
        height
      });
    });

    this.image.src = browse;
  }

  private loadSarviewsBrowseImage(product: SarviewsProduct): void {
    this.isImageLoading = true;
    this.image = new Image();
    const browseService = this.browseMap;
    const currentProd = this.currentSarviewsProduct;
    this.currentSarviewsProduct = product;
    this.currentSarviewsCMRProduct = this.sarviewsService.eventProductToCMRProduct(product);
    const self = this;

    this.image.addEventListener('load', function() {
      if (currentProd === product) {
        return;
      }

      self.isImageLoading = false;
      const [width, height] = [
        this.naturalWidth, this.naturalHeight
      ];

      browseService.setBrowse(product.files.browse_url, {width, height} );
    });

    this.image.src = product.files.browse_url;
  }

  public jobParamsToList(metadata) {
    if (!metadata.job) {
      return [];
    }

    const jobType = models.hyp3JobTypes[metadata.job.job_type];
    const options = !!jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    return options
      .filter(option => metadata.job.job_parameters[option.apiName])
      .map(option => {
        return {name: option.name, val: metadata.job.job_parameters[option.apiName]};
      });
  }
  public closeDialog() {
    this.dialogRef.close();
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }

  public onToggleQueueEventProduct(product: models.SarviewsProduct): void {
    this.onToggleQueueProduct(this.sarviewsService.eventProductToCMRProduct(product));
  }

  public toggleDisplay() {
    this.isShow = !this.isShow;
  }

  public setOnlyShowBrowse(isChecked: boolean) {
    this.store$.dispatch(new uiStore.SetOnlyScenesWithBrowse(isChecked));
  }

  public onNewBrowseSelected(scene, browse): void {
    this.loadBrowseImage(scene, browse);
  }

  public onNewSarviewsBrowseSelected(browse: SarviewsProduct): void {
    this.loadSarviewsBrowseImage(browse);
  }


  public onCopyLink(content: SarviewProductGranule[]): void {
    const names = content.map(val => val.granule_name).join(',');
    this.clipboard.copyFromContent(names);
    this.notificationService.info( '', `Scene${content.length > 1 ? 's ' : ' '}Copied`);
  }


  public OpenProductInSarviews() {
    const url = this.sarviewsService.getSarviewsEventPinnedUrl(
      this.sarviewsEvent.event_id,
      [this.currentSarviewsProduct.product_id]
      );
    window.open(url);
  }

  public getEventURL() {
    const isQuake = this.sarviewsEvent.event_type === 'quake';

    if (isQuake) {
      return this.sarviewsService.getUSGSEventUrl((this.sarviewsEvent as models.SarviewsQuakeEvent).usgs_event_id);
    } else {
      return this.sarviewsService.getSmithsonianURL((this.sarviewsEvent as models.SarviewsVolcanicEvent).smithsonian_event_id);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(false));
  }
}
