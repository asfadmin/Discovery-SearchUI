import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { saveAs } from 'file-saver';

import { combineLatest, switchMap } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';
import * as hyp3Store from '@store/hyp3';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import {
  MapService,
  ScenesService,
  ScreenSizeService,
  PossibleHyp3JobsService,
  PairService,
  Hyp3ApiService,
  Hyp3JobStatusService,
  ExportService,
} from '@services';

import * as models from '@models';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import {
  CodeExportComponent,
  CodeExportType,
} from '@components/shared/code-export';
import {
  ProjectNameDialogComponent,
  ProjectNameDialogData,
  ProjectNameDialogResult,
} from '@components/shared/project-name-dialog';
import { MatDialog } from '@angular/material/dialog';
import {
  NgClass,
  AsyncPipe,
  TitleCasePipe,
  KeyValuePipe,
} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import {
  MatMenuTrigger,
  MatMenu,
  MatMenuItem,
  MatMenuContent,
} from '@angular/material/menu';
import { OnDemandAddMenuComponent } from '@components/shared/on-demand-add-menu/on-demand-add-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scenes-list-header',
  templateUrl: './scenes-list-header.component.html',
  styleUrls: ['./scenes-list-header.component.scss'],
  imports: [
    NgClass,
    MatIcon,
    MatTooltip,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatMenuTrigger,
    OnDemandAddMenuComponent,
    MatMenu,
    MatMenuItem,
    MatMenuContent,

    FontAwesomeModule,
    AsyncPipe,
    TitleCasePipe,
    KeyValuePipe,
    TranslateModule,
  ],
})
export class ScenesListHeaderComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(MapService);
  private scenesService = inject(ScenesService);
  private pairService = inject(PairService);
  private screenSize = inject(ScreenSizeService);
  private hyp3 = inject(Hyp3ApiService);
  private hyp3JobStatus = inject(Hyp3JobStatusService);
  private possibleHyp3JobsService = inject(PossibleHyp3JobsService);
  private exportService = inject(ExportService);
  private dialog = inject(MatDialog);

  public copyIcon = faCopy;
  public pairs$ = this.pairService.pairs$;
  private pairProducts$ = this.pairService.productsFromPairs$;

  public totalResultCount$ = combineLatest([
    this.store$.select(searchStore.getSearchAmount),
    this.scenesService.scenes$,
  ]).pipe(
    map(
      ([count, scenes]) =>
        count +
        scenes?.filter((scene) => scene.metadata.productType === 'BURST')
          .length,
    ),
  );

  public currentDatasetID$ = this.store$
    .select(filtersStore.getSelectedDataset)
    .pipe(map((dataset) => dataset.id));
  public numberOfScenes$ = this.store$.select(scenesStore.getNumberOfScenes);
  public numberOfProducts$ = this.store$.select(
    scenesStore.getNumberOfProducts,
  );

  public products = [];
  public downloadableProds = [];

  public productsByType$: Observable<Record<string, models.CMRProduct[]>> =
    this.store$.select(scenesStore.getAllProducts).pipe(
      map((scenes: []) =>
        scenes.reduce((prev, curr: models.CMRProduct) => {
          if (!prev[curr.productTypeDisplay]) {
            prev[curr.productTypeDisplay] = [];
          }
          prev[curr.productTypeDisplay].push(curr);

          return prev;
        }, {}),
      ),
      tap((products) => (this.operaProductsByType = products)),
    );

  public numOfScenesWithPolygon$ = this.scenesService.scenes$.pipe(
    map((scenes) => scenes.filter((scene) => !!scene.metadata.polygon).length),
  );

  public totalVirtualProducts$ = this.store$
    .select(scenesStore.getAllProducts)
    .pipe(
      map((scenes) => {
        return scenes.filter((x) => x?.virtual ?? false).length;
      }),
    );

  public productCountByType$ = this.productsByType$.pipe(
    map((products) =>
      Object.keys(products).reduceRight((prev: object, curr: string) => {
        prev[curr] = products[curr].length;
        return prev;
      }, {}),
    ),
  );

  public numBaselineScenes$ = this.scenesService.scenes$.pipe(
    map((scenes) => scenes.length),
  );

  public numUnfilteredBaselineScenes$ =
    this.scenesService.unfilteredScenes$.pipe(map((scenes) => scenes.length));

  private products$ = this.scenesService.products$();
  private operaProductsByType: Record<string, models.CMRProduct[]> = {};

  public isBurstStack$ = combineLatest([
    this.products$,
    this.store$.select(searchStore.getSearchType),
  ]).pipe(
    map(
      ([scenes, currentSearchType]) =>
        (currentSearchType === this.SearchTypes.BASELINE && scenes?.length > 0
          ? scenes[0].metadata.productType === 'BURST'
          : false) ||
        (currentSearchType === this.SearchTypes.SBAS && scenes?.length > 0
          ? scenes[0].metadata.productType === 'BURST'
          : false),
    ),
  );

  public numPairs$ = this.store$.select(searchStore.getSearchType).pipe(
    filter((searchType) => searchType !== models.SearchType.CUSTOM_PRODUCTS),
    switchMap((_) => this.pairs$),
    filter((pairs) => !!pairs),
    map((pairs) => pairs.pairs.length + pairs.custom.length),
  );

  private currentBurstProducts$ = this.products$.pipe(
    map((products) =>
      products.filter(
        (p) =>
          p.metadata.productType === 'BURST' ||
          p.metadata.productType === 'BURST_XML',
      ),
    ),
  );

  public burstDataProducts$ = this.currentBurstProducts$.pipe(
    map((products) =>
      products.filter((p) => p.metadata.productType === 'BURST'),
    ),
  );

  public SBASburstDataProducts$ = combineLatest([
    this.burstDataProducts$,
    this.pairProducts$,
  ]).pipe(
    map(([products, pairs]) => {
      const pairNames = pairs.map((p) => p.name);
      const output = products.filter((p) =>
        pairNames.find((name) => name === p.name),
      );
      return output;
    }),
  );

  public burstMetadataProducts$ = this.currentBurstProducts$.pipe(
    map((products) =>
      products.filter((p) => p.metadata.productType === 'BURST_XML'),
    ),
  );

  public SBASburstMetadataProducts$ = combineLatest([
    this.burstMetadataProducts$,
    this.pairProducts$,
  ]).pipe(
    map(([products, pairs]) => {
      const pairNames = pairs.map((p) => p.name);
      const output = products.filter((p) =>
        pairNames.find((name) => name === p.name),
      );
      return output;
    }),
  );

  public SBASBurstProductsLength$ = combineLatest([
    this.SBASburstDataProducts$.pipe(map((products) => products.length)),
    this.SBASburstMetadataProducts$.pipe(map((products) => products.length)),
  ]).pipe(map(([data, metadata]) => data + metadata));

  public pairs: models.CMRProductPair[];
  public sbasProducts: models.CMRProduct[] = [];
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
  public ApiFormat = models.AsfApiOutputFormat;

  private subs = new SubSink();

  public RTC = models.hyp3JobTypes.RTC_GAMMA;
  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;

  public hyp3able = { total: 0, byJobType: [] };
  public hyp3ableEventProducts = { total: 0, byJobType: [] };
  public moreHyp3JobsToLoad: boolean;

  ngOnInit() {
    this.subs.add(
      this.pairProducts$.subscribe((products) => {
        this.sbasProducts = products;
      }),
    );

    this.subs.add(
      this.possibleHyp3JobsService.possibleJobs$.subscribe((possibleJobs) => {
        this.hyp3able = this.hyp3.getHyp3ableProducts(possibleJobs);
      }),
    );

    this.subs.add(
      this.products$.subscribe((products) => {
        this.products = products;
        this.downloadableProds = this.hyp3JobStatus.downloadable(products);
      }),
    );

    this.subs.add(
      this.store$
        .select(searchStore.getSearchType)
        .pipe(
          filter(
            (searchType) => searchType !== models.SearchType.CUSTOM_PRODUCTS,
          ),
          switchMap((_) => this.pairs$),
          filter((pairs) => !!pairs),
          map((pairs) => pairs.pairs.length + pairs.custom.length),
          withLatestFrom(this.pairs$),
        )
        .subscribe(([_, { pairs, custom }]) => {
          this.pairs = [...pairs, ...custom];
        }),
    );

    this.subs.add(
      combineLatest([
        this.scenesService.scenes$,
        this.store$.select(filtersStore.getProductTypes),
        this.store$.select(searchStore.getSearchType),
        this.store$.select(filtersStore.getSelectedDataset),
      ])
        .pipe(debounceTime(250))
        .subscribe(([scenes, productTypes, searchType, selectedDataset]) => {
          this.canHideRawData =
            searchType === models.SearchType.DATASET &&
            scenes.every(
              (scene) =>
                scene.dataset === 'Sentinel-1C' ||
                scene.dataset === 'Sentinel-1B' ||
                scene.dataset === 'Sentinel-1A',
            ) &&
            productTypes.length <= 0 &&
            selectedDataset.id !== models.opera_s1.id;
        }),
    );

    this.subs.add(
      this.store$
        .select(searchStore.getSearchType)
        .subscribe(
          (searchType) =>
            (this.canHideExpiredData =
              searchType === models.SearchType.CUSTOM_PRODUCTS),
        ),
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe((searchType) => {
        this.searchType = searchType;
      }),
    );

    this.subs.add(
      this.store$
        .select(scenesStore.getTemporalSortDirection)
        .subscribe((temporalSort) => (this.temporalSort = temporalSort)),
    );

    this.subs.add(
      this.store$
        .select(scenesStore.getPerpendicularSortDirection)
        .subscribe((perpSort) => (this.perpendicularSort = perpSort)),
    );

    this.subs.add(
      this.store$
        .select(uiStore.getShowS1RawData)
        .subscribe((showS1RawData) => (this.showS1RawData = showS1RawData)),
    );

    this.subs.add(
      this.store$
        .select(uiStore.getShowExpiredData)
        .subscribe(
          (showExpiredData) => (this.showExpiredData = showExpiredData),
        ),
    );

    this.subs.add(
      this.store$
        .select(queueStore.getQueuedProducts)
        .subscribe((products) => (this.queuedProducts = products)),
    );

    this.subs.add(
      this.store$
        .select(hyp3Store.getAreMoreJobsToLoad)
        .subscribe((moreToLoad) => (this.moreHyp3JobsToLoad = moreToLoad)),
    );
  }

  public onZoomToResults(): void {
    this.mapService.zoomToResults();
  }

  public onToggleS1RawData(): void {
    this.store$.dispatch(
      this.showS1RawData
        ? new uiStore.HideS1RawData()
        : new uiStore.ShowS1RawData(),
    );
  }

  public onToggleExpiredData(): void {
    this.store$.dispatch(
      this.showExpiredData
        ? new uiStore.HideExpiredData()
        : new uiStore.ShowExpiredData(),
    );
  }

  public onTogglePerpendicularSort(): void {
    const direction = this.oppositeDirection(this.perpendicularSort);

    this.store$.dispatch(
      new scenesStore.SetTemporalSortDirection(models.ColumnSortDirection.NONE),
    );
    this.store$.dispatch(
      new scenesStore.SetPerpendicularSortDirection(direction),
    );
  }

  public onToggleTemporalSort(): void {
    const direction = this.oppositeDirection(this.temporalSort);

    this.store$.dispatch(
      new scenesStore.SetPerpendicularSortDirection(
        models.ColumnSortDirection.NONE,
      ),
    );
    this.store$.dispatch(new scenesStore.SetTemporalSortDirection(direction));
  }

  private oppositeDirection(
    currentDir: models.ColumnSortDirection,
  ): models.ColumnSortDirection {
    let direction = models.ColumnSortDirection.INCREASING;

    if (currentDir === models.ColumnSortDirection.INCREASING) {
      direction = models.ColumnSortDirection.DECREASING;
    } else if (currentDir === models.ColumnSortDirection.DECREASING) {
      direction = models.ColumnSortDirection.INCREASING;
    }

    return direction;
  }

  public queueAllProducts(products: models.CMRProduct[]): void {
    if (this.searchType === models.SearchType.CUSTOM_PRODUCTS) {
      products = this.hyp3JobStatus.downloadable(products);
    }

    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public queueProductsOfType(productType): void {
    this.queueAllProducts(this.operaProductsByType[productType as string]);
  }

  public queueSBASProducts(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onDownloadPairCSV() {
    const pairRows = this.pairs
      .map(([reference, secondary]) => {
        const temporalBaseline = Math.abs(
          reference.metadata.temporal - secondary.metadata.temporal,
        );
        const perpendicularBaseline = Math.abs(
          reference.metadata.perpendicular - secondary.metadata.perpendicular,
        );

        return (
          `${reference.name},${reference.downloadUrl},` +
          `${secondary.name},${secondary.downloadUrl},` +
          `${perpendicularBaseline},${temporalBaseline}`
        );
      })
      .join('\n');

    const pairsHeader =
      'Reference, Reference URL, Secondary, Secondary URL, ' +
      'Pair Perpendicular Baseline (meters), Pair Temporal Baseline (days)';

    const pairsCSV = `${pairsHeader}\n${pairRows}`;

    const blob = new Blob([pairsCSV], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'asf-sbas-pairs.csv');
  }

  public formatNumber(num: number): string {
    return (num || 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  public onMakeDownloadScript(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.MakeDownloadScriptFromList(products));
  }

  public onMetadataExport(format: models.AsfApiOutputFormat): void {
    const action = new queueStore.DownloadSearchtypeMetadata(format);

    if (this.searchType === this.SearchTypes.BASELINE) {
      this.store$.dispatch(action);
    }
  }

  public onOpenHelp(infoUrl) {
    window.open(infoUrl);
  }

  public onPythonCodeExport() {
    this.exportService.combineSearchOptionsToHyp3SDK$
      .pipe(take(1))
      .subscribe((codeStuff) => {
        this.dialog.open(CodeExportComponent, {
          data: {
            codeStuff,
            codeExportType: CodeExportType.HYP3_SDK,
          },
          width: '550px',
          height: '500px',
          maxWidth: '550px',
          maxHeight: '500px',
        });
      });
  }

  public onBulkProjectNameUpdate(): void {
    combineLatest([
      this.store$.select(hyp3Store.getHyp3User),
      this.store$.select(hyp3Store.getOnDemandUserId),
    ])
      .pipe(take(1))
      .subscribe(([hyp3User, filterUserId]) => {
        const dialogRef = this.dialog.open<
          ProjectNameDialogComponent,
          ProjectNameDialogData,
          ProjectNameDialogResult
        >(ProjectNameDialogComponent, {
          width: '400px',
          data: {
            currentName: '',
            products: this.products,
            loggedInUserId: hyp3User?.user_id,
            filterUserId: filterUserId || undefined,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result !== undefined) {
            // Dialog handles the rename operation and shows progress
            // We just need to update the filter and refresh search
            this.store$.dispatch(new searchStore.ClearSearch());
            this.store$.dispatch(
              new filtersStore.SetProjectName(result.newName),
            );
            this.store$.dispatch(new searchStore.MakeSearch());
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
