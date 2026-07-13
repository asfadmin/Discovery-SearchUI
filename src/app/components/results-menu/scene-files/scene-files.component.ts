import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { SubSink } from 'subsink';

import { combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';

import { AsfApiService, Hyp3ApiService } from '@services';
import * as models from '@models';

import { MatList, MatListItem } from '@angular/material/list';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { ScreenSizeService } from '@services';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import * as filterStore from '@store/filters';
import { L1L2BrowseCollectionMapping } from '@models/datasets/nisar';
import { AsyncPipe } from '@angular/common';
import { SceneFileComponent } from './scene-file/scene-file.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { getStaticQueryParams } from '@models/datasets/opera_s1';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-scene-files',
  templateUrl: './scene-files.component.html',
  styleUrls: ['./scene-files.component.scss'],
  imports: [
    MatList,
    MatProgressSpinner,
    SceneFileComponent,
    AsyncPipe,
    TranslateModule,
    MatListItem,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
})
export class SceneFilesComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private hyp3 = inject(Hyp3ApiService);
  dialog = inject(MatDialog);
  private screenSize = inject(ScreenSizeService);
  private asfApiService = inject(AsfApiService);

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  scrollPort: CdkVirtualScrollViewport;
  @Input() isScrollable = true;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public products: models.CMRProduct[] = [];
  public queuedProductIds: string[] = [];
  public hyp3ableByProduct: object;

  public queuedProductIds$ = this.store$
    .select(queueStore.getQueuedProductIds)
    .pipe(map((names) => new Set(names)));

  private nisarOrbitEphemera$ = this.asfApiService.getNisarOrbitEphemera().pipe(
    map((products) =>
      products.map((product) => {
        product.productTypeDisplay = `${product.metadata.productType} Orbit Ephemera XML`;
        return product;
      }),
    ),
  );
  public loadingHyp3JobName: string | null = null;
  public validJobTypesByProduct: Record<string, models.Hyp3JobType[]> = {};

  public isUserLoggedIn: boolean;
  public hasAccessToRestrictedData: boolean;
  public showDemWarning: boolean;

  public dynamicQueryLoaded = signal(false);

  private scene = toSignal(this.store$.select(scenesStore.getSelectedScene));
  private sceneProducts = toSignal(
    this.store$
      .select(scenesStore.getSelectedSceneProducts)
      .pipe(debounceTime(0)),
    { initialValue: [] as models.CMRProduct[] },
  );
  // 'default' holds ungrouped products (e.g. the main science HDF5) and is
  // rendered first, at the top of the file list.
  readonly groups = computed(() => {
    const scene = this.scene();
    if (scene?.dataset === 'NISAR' && scene.metadata?.subproducts?.length > 0) {
      return [
        'default',
        ...models.nisar.productTypeDisplays.groups.map((g) => g.name),
      ];
    }

    return null;
  });
  readonly selectedSceneGroups = computed(() => {
    const groups = this.groups();

    if (groups === null) {
      return null;
    }

    const productsByGroups = groups.reduce(
      (prev, curr) => {
        prev[curr] = [];
        return prev;
      },
      {} as Record<string, models.CMRProduct[]>,
    );
    for (const product of this.sceneProducts() ?? []) {
      const groupName = product.productTypeGroup ?? 'default';
      (productsByGroups[groupName] ?? productsByGroups['default']).push(
        product,
      );
    }
    return productsByGroups;
  });
  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedSceneProducts)
        .pipe(debounceTime(0))
        .subscribe((products) => {
          this.products = products;
          this.validJobTypesByProduct = {};
          this.products?.forEach((product) => {
            this.validJobTypesByProduct[product.id] =
              this.hyp3.getValidJobTypes([product]);
          });
          this.showDemWarning = this.demWarning(products);
        }),
    );

    this.subs.add(
      this.queuedProductIds$.subscribe(
        (ids) => (this.queuedProductIds = Array.from(ids)),
      ),
    );

    this.subs.add(
      this.store$
        .select(userStore.getIsUserLoggedIn)
        .subscribe((isLoggedIn) => (this.isUserLoggedIn = isLoggedIn)),
    );
    this.subs.add(
      this.store$
        .select(userStore.getHasRestrictedDataAccess)
        .subscribe((hasAccess) => (this.hasAccessToRestrictedData = hasAccess)),
    );
    this.subs.add(
      this.store$
        .select(hyp3Store.getSubmittingJobName)
        .subscribe((jobName) => (this.loadingHyp3JobName = jobName)),
    );
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }

  public demWarning(products): boolean {
    let warn = false;

    if (!products) {
      return false;
    }

    products.forEach((product) => {
      if (
        product.dataset === 'ALOS' &&
        product.metadata.productType &&
        product.metadata.productType.includes('RTC_')
      ) {
        warn = true;
      }
    });

    return warn;
  }

  public onQueueHyp3Job(job: models.QueuedHyp3Job) {
    this.store$.dispatch(new queueStore.AddJob(job));
  }

  public onRenameJobProjectName(
    product: models.CMRProduct,
    newProjectName: string,
  ) {
    const job = product.metadata.job;
    this.hyp3.updateJobName$(job.job_id, newProjectName).subscribe((job) => {
      const action = new scenesStore.UpdateProductWithNewProjectName({
        productId: product.id,
        name: job.name,
      });
      this.store$.dispatch(action);
    });
  }

  public formatProductName(product_name: string, desiredLen?: number) {
    const extrasWidthPx = 260;
    const charWidthPx = 10;
    const divWidthPx = document.getElementById(
      'event-selection-list',
    ).offsetWidth;
    const defaultLen = Math.trunc((divWidthPx - extrasWidthPx) / charWidthPx);
    desiredLen = desiredLen ? desiredLen : defaultLen;
    desiredLen = desiredLen < 15 ? 15 : desiredLen;
    const tailLen = 8;
    const pNameLen = product_name.length;
    if (pNameLen > desiredLen) {
      return (
        product_name.slice(0, desiredLen - tailLen - 1) +
        '...' +
        product_name.slice(pNameLen - tailLen)
      );
    }
    return product_name;
  }

  public hasSubquery$ = this.store$.select(scenesStore.getSelectedScene).pipe(
    debounceTime(100),
    distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
    withLatestFrom(this.store$.select(filterStore.getUseCalibrationData)),
    map(([scene, useCalibrationData]) => {
      return (
        this.operaSubqueryCriteria(scene, useCalibrationData) ||
        this.nisarSubqueryCriteria(scene)
      );
    }),
  );

  private operaSubqueryCriteria(
    scene: models.CMRProduct,
    useCalibrationData: boolean,
  ) {
    return (
      !useCalibrationData &&
      !!scene &&
      ['RTC', 'CSLC'].includes(scene?.metadata?.productType) &&
      scene?.id.startsWith('OPERA')
    );
  }
  private nisarSubqueryCriteria(scene: models.CMRProduct) {
    const isNisar = !!scene && scene.id?.startsWith('NISAR');
    const processingLevel = scene?.metadata?.productType ?? '';

    return (
      isNisar &&
      [
        'RSLC',
        'RIFG',
        'RUNW',
        'ROFF',
        'GSLC',
        'GCOV',
        'GUNW',
        'GOFF',
        'RRSD',
      ].includes(processingLevel)
    );
  }
  public dynamicallySearchedProduct$ = combineLatest([
    this.store$.select(scenesStore.getSelectedScene),
    this.nisarOrbitEphemera$,
  ]).pipe(
    tap((_) => this.dynamicQueryLoaded.set(false)),
    debounceTime(100),
    distinctUntilChanged((prev, curr) => prev[0]?.id === curr[0]?.id),
    withLatestFrom(this.store$.select(filterStore.getUseCalibrationData)),
    switchMap(([[scene, orbitEphemera], useCalibrationData]) => {
      if (
        !useCalibrationData &&
        !!scene &&
        ['RTC', 'CSLC'].includes(scene?.metadata?.productType) &&
        scene?.id.startsWith('OPERA')
      ) {
        const queryParams = getStaticQueryParams(
          scene.metadata.productType,
          scene.metadata.date,
          scene.metadata?.opera?.operaBurstID,
        );

        return this.asfApiService.miniQuery(queryParams).pipe(
          tap((products) =>
            products.map((product) => {
              product.productTypeDisplay = 'Local Incidence Angle GeoTIFF';
              product.bytes = 0;
              product.downloadUrl = product.metadata.opera.additionalUrls.find(
                (url) => url.endsWith('local_incidence_angle.tif'),
              );
              return product;
            }),
          ),
        );
      } else if (!!scene && scene.id?.startsWith('NISAR')) {
        let browseQuery = of<models.CMRProduct[]>([]);
        if (scene.id.startsWith('NISAR_L1')) {
          if (
            !Object.keys(L1L2BrowseCollectionMapping).includes(
              scene.metadata.productType,
            )
          ) {
            return of([]);
          }

          const queryParams = this.getNisarL2Params(
            scene.id,
            scene.metadata.productType,
          );

          browseQuery = this.asfApiService.miniQuery(queryParams);
        }

        return browseQuery.pipe(
          map((results) => {
            let output = [...results];
            if (scene.metadata.nisar.orbitType) {
              output = output.concat(orbitEphemera);
            }
            return output;
          }),
        );
      } else {
        return of([]);
      }
    }),
    tap((_) => this.dynamicQueryLoaded.set(true)),
  );

  public getNisarL2Params(productID: string, productType: string) {
    return {
      granule_list: productID
        .replaceAll(
          productType,
          L1L2BrowseCollectionMapping[productType].productType,
        )
        .replaceAll('L1', 'L2'),
    };
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
