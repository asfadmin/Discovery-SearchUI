import { Component, OnInit, Input, OnDestroy, inject } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import {
  ScreenSizeService,
  MapService,
  ScenesService,
  PairService,
  Hyp3ApiService,
  PossibleHyp3JobsService,
  Hyp3JobStatusService,
} from '@services';

import { SubSink } from 'subsink';

import * as models from '@models';
import { NgClass, AsyncPipe } from '@angular/common';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { ScenesListHeaderComponent } from '../scenes-list-header/scenes-list-header.component';
import { ScenesListComponent } from '../scenes-list/scenes-list.component';
import { SceneDetailComponent } from '../scene-detail/scene-detail.component';
import { SceneSearchToolbarComponent } from '@components/results-menu/scene-search-toolbar/scene-search-toolbar.component';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { OnDemandAddMenuComponent } from '@components/shared/on-demand-add-menu/on-demand-add-menu.component';
import { MatButton } from '@angular/material/button';
import { BaselineChartComponent } from '../../baseline-chart/baseline-chart.component';
import { TranslateModule } from '@ngx-translate/core';

enum CardViews {
  LIST = 0,
  DETAIL = 1,
}

@Component({
  selector: 'app-baseline-results-menu',
  templateUrl: './baseline-results-menu.component.html',
  styleUrls: [
    './baseline-results-menu.component.scss',
    '../results-menu.component.scss',
  ],
  imports: [
    MatCard,
    MatCardSubtitle,
    ScenesListHeaderComponent,
    ScenesListComponent,
    SceneDetailComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatTooltip,
    MatIcon,
    MatMenuTrigger,
    OnDemandAddMenuComponent,
    MatMenu,
    MatMenuItem,
    MatButton,
    NgClass,
    BaselineChartComponent,
    AsyncPipe,
    TranslateModule,
    SceneSearchToolbarComponent,
  ],
})
export class BaselineResultsMenuComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  private mapService = inject(MapService);
  private scenesService = inject(ScenesService);
  private pairService = inject(PairService);
  private hyp3 = inject(Hyp3ApiService);
  private hyp3JobStatus = inject(Hyp3JobStatusService);
  private possibleHyp3JobsService = inject(PossibleHyp3JobsService);

  @Input() resize$: Observable<void>;

  public numBaselineScenes$ = this.scenesService.scenes$.pipe(
    map((scenes) => scenes.length),
  );

  public numUnfilteredBaselineScenes$ =
    this.scenesService.unfilteredScenes$.pipe(map((scenes) => scenes.length));

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
  public AriaS1Gunw = models.hyp3JobTypes.ARIA_S1_GUNW;
  public ApiFormat = models.AsfApiOutputFormat;

  public hyp3able: {
    total: number;
    byJobType: models.Hyp3ableProductByJobType[];
  };

  ngOnInit(): void {
    this.subs.add(
      combineLatest([
        this.scenesService.products$(),
        this.pairService.pairs$,
      ]).subscribe(([products, { pairs, custom }]) => {
        this.products = products;
        this.downloadableProds = this.hyp3JobStatus.downloadable(products);
        this.pairs = [...pairs, ...custom];
      }),
    );

    this.subs.add(
      this.possibleHyp3JobsService.possibleJobs$.subscribe((possibleJobs) => {
        this.hyp3able = this.hyp3.getHyp3ableProducts(possibleJobs);
      }),
    );

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        (point) => (this.breakpoint = point),
      ),
    );

    this.subs.add(
      this.pairService.productsFromPairs$.subscribe(
        (products) => (this.sbasProducts = products),
      ),
    );

    this.subs.add(
      this.store$
        .select(queueStore.getQueuedProducts)
        .subscribe((products) => (this.queuedProducts = products)),
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
      products = this.hyp3JobStatus.downloadable(products);
    }

    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onMetadataExport(
    products: models.CMRProduct[],
    format: models.AsfApiOutputFormat,
  ): void {
    const currentQueue = this.queuedProducts;
    const action = new queueStore.DownloadSearchtypeMetadata(format);

    this.clearDispatchRestoreQueue(action, products, currentQueue);
  }

  public onMakeDownloadScript(products: models.CMRProduct[]): void {
    const currentQueue = this.queuedProducts;

    this.clearDispatchRestoreQueue(
      new queueStore.MakeDownloadScript(),
      products,
      currentQueue,
    );
  }

  private clearDispatchRestoreQueue(
    queueStoreAction: Action,
    products: models.CMRProduct[],
    currentQueue: models.CMRProduct[],
  ): void {
    const actions = [
      new queueStore.ClearQueue(),
      new queueStore.AddItems(products),
      queueStoreAction,
      new queueStore.ClearQueue(),
      new queueStore.AddItems(currentQueue),
    ];

    actions.forEach((action) => this.store$.dispatch(action));
  }

  public isOfCardView(view: CardViews) {
    return this.view === view;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
