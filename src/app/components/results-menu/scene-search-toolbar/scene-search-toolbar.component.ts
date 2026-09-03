import { NgStyle, NgClass, UpperCasePipe, AsyncPipe } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import * as models from '@models';
import {
  ScreenSizeService,
  PropertyService,
  DatasetForProductService,
} from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';

@Component({
  selector: 'app-scene-search-toolbar',
  imports: [
    NgStyle,
    NgClass,
    MatButton,
    AsyncPipe,
    UpperCasePipe,
    MatTooltip,
    TranslateModule,
  ],
  templateUrl: './scene-search-toolbar.component.html',
  styleUrl: './scene-search-toolbar.component.scss',
})
export class SceneSearchToolbarComponent {
  private screenSize = inject(ScreenSizeService);
  private store$ = inject<Store<AppState>>(Store);
  private datasetForProduct = inject(DatasetForProductService);
  public prop = inject(PropertyService);

  public p = models.Props;
  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public searchTypes = models.SearchType;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  private dateRange = this.store$.selectSignal(filtersStore.getDateRange);

  readonly scene = this.store$.selectSignal(scenesStore.getSelectedScene);

  readonly selectedProducts = this.store$.selectSignal(
    scenesStore.getSelectedSceneProducts,
  );

  readonly dataset = computed(() => {
    const scene = this.scene();
    return scene ? this.datasetForProduct.match(scene) : undefined;
  });

  readonly sceneCanInSAR = computed(() => {
    const dataset = this.dataset();
    const selectedProducts = this.selectedProducts();

    return (
      dataset?.id === models.sentinel_1.id ||
      selectedProducts.some((product) => !!product.metadata.canInSAR)
    );
  });

  readonly hasBaselineProductType = computed(() => {
    const dataset = this.dataset();
    const selectedProducts = this.selectedProducts();

    if (dataset?.id === 'ALOS') {
      return false;
    }
    if (!selectedProducts || dataset?.id !== models.sentinel_1.id) {
      return true;
    }
    if (dataset?.id === models.beta.id) {
      return true;
    }
    return selectedProducts.some(
      (product) =>
        product.metadata.productType === 'SLC' ||
        product.metadata.productType === 'BURST',
    );
  });

  readonly hasBaseline = computed(() => {
    const dataset = this.dataset();

    return (
      this.prop.isRelevant(this.p.BASELINE_TOOL, dataset) &&
      this.sceneCanInSAR() &&
      this.hasBaselineProductType()
    );
  });

  private readonly hasPathFrame = computed(() => {
    const dataset = this.dataset();

    return (
      this.prop.isRelevant(this.p.PATH, dataset) &&
      this.prop.isRelevant(this.p.FRAME, dataset)
    );
  });

  private readonly isUavsar = computed(() => this.dataset()?.id === 'UAVSAR');
  private readonly isOperaS1 = computed(
    () => this.dataset()?.id === 'OPERA-S1',
  );
  private readonly isBurst = computed(
    () => this.dataset()?.id === 'SENTINEL-1 BURSTS',
  );

  readonly moreLikeThisDisabled = computed(
    () =>
      !(
        this.hasPathFrame() ||
        this.isUavsar() ||
        this.isBurst() ||
        this.isOperaS1()
      ),
  );

  readonly moreLikeThisTooltipKey = computed(() => {
    if (this.isOperaS1()) {
      return 'OPERA_S1_SOURCE_DATA';
    }
    if (this.isBurst()) {
      return 'GEOGRAPHIC_SEARCH_BASED_ON_BURST';
    }
    if (this.hasPathFrame() && !this.isUavsar()) {
      return 'GEOGRAPHIC_SEARCH_BASED_ON_THIS_SCENE_S_PATH_FRAME';
    }
    return 'NOT_ABLE_TO_SELECT_SIMILAR_SCENES_FROM_THIS_SOURCE';
  });

  readonly moreLikeThisLabelKey = computed(() =>
    this.isOperaS1() ? 'SOURCE_DATA' : 'MORE_LIKE_THIS',
  );

  public userProfile = this.store$.selectSignal(userStore.getUserProfile);

  readonly defaultBaselineFiltersID = computed(
    () => this.userProfile()?.defaultFilterPresets?.['Baseline Search'],
  );

  readonly defaultSBASFiltersID = computed(
    () => this.userProfile()?.defaultFilterPresets?.['SBAS Search'],
  );

  public makeBaselineSearch(): void {
    const scene = this.scene();
    if (!scene) {
      return;
    }

    const sceneName = this.baselineSceneName();
    const frame = scene.metadata.frame;

    [
      new searchStore.SetSearchType(models.SearchType.BASELINE),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultBaselineFiltersID()),
    ].forEach((action) => this.store$.dispatch(action));

    if (sceneName?.startsWith('S1-GUNW')) {
      this.store$.dispatch(new scenesStore.SetFilterMaster(frame.toString()));
      this.store$.dispatch(new filtersStore.SetUseFrameForBaseline(true));
      this.store$.dispatch(new filtersStore.SetSelectedDataset(models.beta.id));
    } else {
      this.store$.dispatch(new filtersStore.SetUseFrameForBaseline(false));
      this.store$.dispatch(new scenesStore.SetFilterMaster(sceneName));
      this.store$.dispatch(new filtersStore.SetSelectedDataset(null));
    }
    this.updateDateRange();

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public baselineSceneName(): string {
    const scene = this.scene();
    if (!scene) {
      return '';
    }

    const dataset = this.dataset();
    if (dataset?.id === models.sentinel_1.id) {
      return this.selectedProducts().filter(
        (product) =>
          product.metadata.productType === 'SLC' ||
          product.metadata.productType === 'BURST',
      )[0]?.name;
    }

    return scene.name;
  }

  public makeSBASSearch(): void {
    const scene = this.scene();
    if (!scene) {
      return;
    }

    const sceneName = this.baselineSceneName();

    [
      new searchStore.SetSearchType(models.SearchType.SBAS),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultSBASFiltersID()),
      new scenesStore.SetFilterMaster(sceneName),
    ].forEach((action) => this.store$.dispatch(action));
    this.updateDateRange();

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public moreLikeThis(): void {
    const scene = this.scene();
    if (!scene) {
      return;
    }

    const dataset = this.dataset();

    const shouldClear =
      this.searchType() !== models.SearchType.DATASET ||
      dataset?.id === 'OPERA-S1';

    this.store$.dispatch(
      new searchStore.SetSearchType(models.SearchType.DATASET),
    );

    if (shouldClear) {
      this.store$.dispatch(new searchStore.ClearSearch());
    }

    this.store$.dispatch(
      new filtersStore.SetFiltersSimilarTo({
        product: scene,
        dataset,
      }),
    );
    this.updateDateRange();

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  private updateDateRange() {
    const dateRange = this.dateRange();

    if (dateRange.start) {
      this.store$.dispatch(
        new filtersStore.SetStartDate(new Date(dateRange.start)),
      );
    }
    if (dateRange.end) {
      this.store$.dispatch(
        new filtersStore.SetEndDate(new Date(dateRange.end)),
      );
    }
  }
}
