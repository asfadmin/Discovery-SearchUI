import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import {map} from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import {
  ScreenSizeService, MapService, ScenesService, PairService,
  Hyp3Service, PossibleHyp3JobsService,
} from '@services';

import { SubSink } from 'subsink';

import * as models from '@models';

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

  public numBaselineScenes$ = this.scenesService.scenes$.pipe(
    map(scenes => scenes.length),
  );

  public numUnfilteredBaselineScenes$ = this.scenesService.unfilteredScenes$.pipe(
    map(scenes => scenes.length),
  );

  public pairs = [];
  public products = [];
  public downloadableProds = [];

  public view = CardViews.LIST;
  public Views = CardViews;

  public searchType: models.SearchType;
  public SearchTypes = models.SearchType;
  public sbasProducts: models.CMRProduct[];
  public queuedProducts: models.CMRProduct[];

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  private subs = new SubSink();

  public RTC = models.hyp3JobTypes.RTC_GAMMA;
  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;
  public ApiFormat = models.AsfApiOutputFormat;

  public hyp3able: { total: number, byJobType: models.Hyp3ableProductByJobType[]};

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private mapService: MapService,
    private scenesService: ScenesService,
    private pairService: PairService,
    private hyp3: Hyp3Service,
    private possibleHyp3JobsService: PossibleHyp3JobsService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      combineLatest([
        this.scenesService.products$(),
        this.pairService.pairs$]
      ).subscribe(
        ([products, {pairs, custom}]) => {
          this.products = products;
          this.downloadableProds = this.hyp3.downloadable(products);
          this.pairs = [ ...pairs, ...custom ];
        }
      )
    );

    this.subs.add(
      this.possibleHyp3JobsService.possibleJobs$
      .subscribe(
          possibleJobs => {
            this.hyp3able = this.hyp3.getHyp3ableProducts(possibleJobs);
          }
        )
    );

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        point => this.breakpoint = point
      )
    );

    this.subs.add(
      this.pairService.productsFromPairs$.subscribe(
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
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }

  public onSelectList(): void {
    this.view = CardViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = CardViews.DETAIL;
  }

  public queueAllProducts(products: models.CMRProduct[]): void {
    if (this.searchType === models.SearchType.CUSTOM_PRODUCTS) {
      products = this.hyp3.downloadable(products);
    }

    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onMetadataExport(products: models.CMRProduct[], format: models.AsfApiOutputFormat): void {
    const currentQueue = this.queuedProducts;
    const action = new queueStore.DownloadSearchtypeMetadata(format);

    this.clearDispatchRestoreQueue(action, products, currentQueue);
  }

  public onMakeDownloadScript(products: models.CMRProduct[]): void {
    const currentQueue = this.queuedProducts;

    this.clearDispatchRestoreQueue(
      new queueStore.MakeDownloadScript(),
      products,
      currentQueue
    );
  }

  private clearDispatchRestoreQueue(
    queueStoreAction: Action,
    products: models.CMRProduct[],
    currentQueue: models.CMRProduct[]
  ): void {
    const actions = [
      new queueStore.ClearQueue(),
      new queueStore.AddItems(products),
      queueStoreAction,
      new queueStore.ClearQueue(),
      new queueStore.AddItems(currentQueue)
    ];

    actions.forEach(action =>
      this.store$.dispatch(action)
    );
  }

  public isOfCardView(view: CardViews) {
    return this.view === view;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
