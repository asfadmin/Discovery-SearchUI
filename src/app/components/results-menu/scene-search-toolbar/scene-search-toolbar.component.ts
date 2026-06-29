import { Component, inject, OnInit, OnDestroy } from '@angular/core';

import * as models from '@models';
import { ScreenSizeService, PropertyService } from '@services';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';
import * as userStore from '@store/user';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { map, filter, tap, distinctUntilChanged } from 'rxjs/operators';
import { DatasetForProductService } from '@services';

import { NgStyle, NgClass, UpperCasePipe, AsyncPipe } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { IsRelevantPipe } from '@pipes/relevant.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-scene-search-toolbar',
  imports: [
    NgStyle,
    NgClass,
    MatButton,
    AsyncPipe,
    UpperCasePipe,
    IsRelevantPipe,
    MatTooltip,
    TranslateModule,
  ],
  templateUrl: './scene-search-toolbar.component.html',
  styleUrl: './scene-search-toolbar.component.scss',
})
export class SceneSearchToolbarComponent implements OnInit, OnDestroy {
  private screenSize = inject(ScreenSizeService);
  private store$ = inject<Store<AppState>>(Store);
  private datasetForProduct = inject(DatasetForProductService);

  prop = inject(PropertyService);
  public p = models.Props;
  public scene: models.CMRProduct;
  public selectedProducts: models.CMRProduct[];
  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public hasBaseline: boolean;

  private defaultBaselineFiltersID = '';
  private defaultSBASFiltersID = '';

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public dataset: models.Dataset;
  private subs = new SubSink();

  private dateRange: { start: Date | null; end: Date | null };

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(userStore.getUserProfile)
        .pipe(
          filter((profile) => !!profile),
          map((profile) => profile.defaultFilterPresets),
          filter((defaultFilterPresets) => !!defaultFilterPresets),
        )
        .subscribe((profile) => {
          this.defaultBaselineFiltersID = profile['Baseline Search'];
          this.defaultSBASFiltersID = profile['SBAS Search'];
        }),
    );

    const scene$ = this.store$
      .select(scenesStore.getSelectedScene)
      .pipe(distinctUntilChanged());

    this.subs.add(
      this.store$
        .select(filtersStore.getDateRange)
        .subscribe((r) => (this.dateRange = r)),
    );

    this.subs.add(
      scene$
        .pipe(
          tap((scene) => (this.scene = scene)),
          filter((scene) => !!scene),
          map((scene) => this.datasetForProduct.match(scene)),
          tap((dataset) => (this.dataset = dataset)),
        )
        .subscribe((_) => this.updateHasBaseline()),
    );
  }

  public updateHasBaseline(): void {
    this.hasBaseline =
      this.prop.isRelevant(this.p.BASELINE_TOOL, this.dataset) &&
      !!this.selectedProducts &&
      this.sceneCanInSAR() &&
      this.hasBaselineProductType();
  }

  public hasBaselineProductType(): boolean {
    if (this.dataset.id === 'ALOS') {
      return false;
    }
    if (!this.selectedProducts || this.dataset.id !== models.sentinel_1.id) {
      return true;
    } else if (this.dataset.id == models.beta.id) {
      return true;
    } else {
      return (
        this.selectedProducts
          .map((product) => product.metadata.productType)
          .filter(
            (productType) => productType === 'SLC' || productType === 'BURST',
          ).length > 0
      );
    }
  }

  public makeBaselineSearch(): void {
    const sceneName = this.baselineSceneName();
    const frame = this.scene.metadata.frame;
    const dateRange = this.dateRange;

    [
      new searchStore.SetSearchType(models.SearchType.BASELINE),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultBaselineFiltersID),
    ].forEach((action) => this.store$.dispatch(action));

    if (sceneName?.startsWith('S1-GUNW')) {
      this.store$.dispatch(new scenesStore.SetFilterMaster(frame.toString()));
      this.store$.dispatch(new filtersStore.SetUseFrameForBaseline(true));
      this.store$.dispatch(new filtersStore.SetSelectedDataset(models.beta.id));
      // this.store$.dispatch(new scenesStore.setdata)
    } else {
      this.store$.dispatch(new filtersStore.SetUseFrameForBaseline(false));
      this.store$.dispatch(new scenesStore.SetFilterMaster(sceneName));
      this.store$.dispatch(new filtersStore.SetSelectedDataset(null));
    }
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

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public baselineSceneName(): string {
    if (!this.scene) {
      return '';
    }

    if (this.dataset.id === models.sentinel_1.id) {
      return this.selectedProducts.filter(
        (product) =>
          product.metadata.productType === 'SLC' ||
          product.metadata.productType === 'BURST',
      )[0].name;
    } else {
      return this.scene.name;
    }
  }

  public makeSBASSearch(): void {
    const sceneName = this.baselineSceneName();
    const dateRange = this.dateRange;

    [
      new searchStore.SetSearchType(models.SearchType.SBAS),
      new searchStore.ClearSearch(),
      new userStore.LoadFiltersPreset(this.defaultSBASFiltersID),
      new scenesStore.SetFilterMaster(sceneName),
    ].forEach((action) => this.store$.dispatch(action));

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

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public sceneCanInSAR(): boolean {
    return (
      this.dataset.id === models.sentinel_1.id ||
      this.selectedProducts
        .map((product) => product.metadata.canInSAR)
        .some((canInSAR) => !!canInSAR)
    );
  }

  public moreLikeThis(): void {
    const scene = this.scene;
    const shouldClear =
      this.searchType() !== models.SearchType.DATASET ||
      this.dataset.id === 'OPERA-S1';
    const dateRange = this.dateRange;

    this.store$.dispatch(
      new searchStore.SetSearchType(models.SearchType.DATASET),
    );

    if (shouldClear) {
      this.store$.dispatch(new searchStore.ClearSearch());
    }

    this.store$.dispatch(
      new filtersStore.SetFiltersSimilarTo({
        product: scene,
        dataset: this.datasetForProduct.match(scene),
      }),
    );

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

    this.store$.dispatch(new searchStore.MakeSearch());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
