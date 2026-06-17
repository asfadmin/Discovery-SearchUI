import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { map, filter, tap, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as userStore from '@store/user';

import * as models from '@models';
import {
  AuthService,
  BrowseOverlayService,
  MapService,
  PropertyService,
  ScreenSizeService,
} from '@services';
import { ImageDialogComponent } from './image-dialog';

import { DatasetForProductService } from '@services';
import { Observable } from 'rxjs';
import {
  NgStyle,
  NgClass,
  AsyncPipe,
  UpperCasePipe,
  TitleCasePipe,
} from '@angular/common';
import {
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard/copy-to-clipboard.component';
import { MatTooltip } from '@angular/material/tooltip';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { SceneMetadataComponent } from '@components/shared/scene-metadata/scene-metadata.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scene-detail',
  templateUrl: './scene-detail.component.html',
  styleUrls: ['./scene-detail.component.scss'],
  providers: [DatasetForProductService],
  imports: [
    MatCardHeader,
    MatCardTitle,
    CopyToClipboardComponent,
    MatCardSubtitle,
    MatTooltip,
    MatCardContent,
    DocsModalComponent,
    SceneMetadataComponent,
    MatIcon,
    NgStyle,
    NgClass,
    MatButton,
    AsyncPipe,
    UpperCasePipe,
    TitleCasePipe,
    TranslateModule,
  ],
})
export class SceneDetailComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  dialog = inject(MatDialog);
  authService = inject(AuthService);
  prop = inject(PropertyService);
  private datasetForProduct = inject(DatasetForProductService);
  private mapService = inject(MapService);
  private browseOverlayService = inject(BrowseOverlayService);

  @Input() isScrollable = true;

  public scene: models.CMRProduct;
  public isActiveSarviewEvent = false;

  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);
  public jobBrowses$ = this.store$.select(
    scenesStore.getSelectedOnDemandProductSceneBrowses,
  );
  public dataset: models.Dataset;
  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public isLoggedIn: boolean;
  public sceneLen: number;
  public p = models.Props;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isImageLoading = false;
  public selectedProducts: models.CMRProduct[];
  public hasBaseline: boolean;
  public browseIndex = 0;
  public detailsOpen = true;
  public masterOffsets$ = this.store$.select(scenesStore.getMasterOffsets);
  public asfWebsite = models.asfWebsite;

  private defaultBaselineFiltersID = '';
  private defaultSBASFiltersID = '';
  private dateRange: { start: Date | null; end: Date | null };

  public isBrowseOverlayEnabled$: Observable<boolean> =
    this.browseOverlayService.isBrowseOverlayEnabled$;

  public isBrowseOverlayEnabled = false;

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.isBrowseOverlayEnabled$.subscribe(
        (enabled) => (this.isBrowseOverlayEnabled = enabled),
      ),
    );

    this.subs.add(
      this.store$
        .select(userStore.getIsUserLoggedIn)
        .subscribe((isLoggedIn) => (this.isLoggedIn = isLoggedIn)),
    );

    this.subs.add(
      this.store$
        .select(filtersStore.getDateRange)
        .subscribe((r) => (this.dateRange = r)),
    );

    this.subs.add(
      this.screenSize.size$
        .pipe(map((size) => (size.width > 1750 ? 32 : 16)))
        .subscribe((len) => (this.sceneLen = len)),
    );

    const scene$ = this.store$.select(scenesStore.getSelectedScene).pipe(
      distinctUntilChanged(),
      tap((_) => (this.isImageLoading = true)),
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

    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedSceneProducts)
        .pipe(tap((products) => (this.selectedProducts = products)))
        .subscribe((_) => {
          this.updateHasBaseline();
          this.browseIndex = 0;
        }),
    );

    this.subs.add(
      this.store$
        .select(searchStore.getSearchType)
        .subscribe((searchType) => (this.searchType = searchType)),
    );

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
  }

  public updateHasBaseline(): void {
    this.hasBaseline =
      this.prop.isRelevant(this.p.BASELINE_TOOL, this.dataset) &&
      !!this.selectedProducts &&
      this.sceneCanInSAR() &&
      this.hasBaselineProductType();
  }

  public sceneCanInSAR(): boolean {
    return (
      this.dataset.id === models.sentinel_1.id ||
      this.selectedProducts
        .map((product) => product.metadata.canInSAR)
        .some((canInSAR) => !!canInSAR)
    );
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

  public sceneHasBrowse() {
    return (
      !!this.scene.browses &&
      this.scene.browses.length > 0 &&
      !this.scene?.browses[0].includes('no-browse')
    );
  }

  public productHasSceneBrowses() {
    if (this.searchType === this.searchTypes.CUSTOM_PRODUCTS) {
      return this.scene.metadata.job.scenes.some(
        (x) => !x.browses[0].includes('no-browse'),
      );
    }
    return false;
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

  public onOpenImage(): void {
    if (!this.sceneHasBrowse()) {
      return;
    }

    this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(true));

    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '99%',
      maxWidth: '99%',
      height: '99%',
      maxHeight: '99%',
      panelClass: 'image-dialog',
    });

    this.subs.add(
      dialogRef
        .afterClosed()
        .subscribe((_) =>
          this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(false)),
        ),
    );
  }

  public onIncrementBrowseIndex() {
    if (this.browseIndex === this.scene.browses.length - 1) {
      return;
    }
    const newIndex = this.browseIndex + 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onDecrementBrowseIndex() {
    if (this.browseIndex === 0) {
      return;
    }
    const newIndex = this.browseIndex - 1;
    this.onUpdateBrowseIndex(newIndex);
  }

  public onUpdateBrowseIndex(newIndex: number) {
    if (!this.isBrowseOverlayEnabled) {
      return;
    }

    this.browseIndex = newIndex;
    const [url, wkt] = [
      this.scene.browses[this.browseIndex],
      this.scene.metadata.polygon,
    ];

    // for OPERA-S1 geotiffs
    // if(this.scene?.id.startsWith('OPERA')) {
    //   url = this.scene.downloadUrl;
    // }

    this.mapService.setSelectedBrowse(url, wkt, this.scene);
  }

  public onSetSelectedAsMaster() {
    this.store$.dispatch(new scenesStore.SetMaster(this.scene.name));
  }

  public moreLikeThis(): void {
    const scene = this.scene;
    const shouldClear =
      this.searchType !== models.SearchType.DATASET ||
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

  public staticLayer() {
    const operaBurstID = this.scene.metadata.opera.operaBurstID;
    const sensorDate = new Date(this.scene.metadata.date.toDate());
    const staticType = this.scene.metadata.productType + '-STATIC';
    this.store$.dispatch(new searchStore.ClearSearch());
    this.store$.dispatch(new filtersStore.SetSelectedDataset('OPERA-S1'));
    this.store$.dispatch(new filtersStore.setOperaBurstIDs([operaBurstID]));
    this.store$.dispatch(
      new filtersStore.SetProductTypes([
        models.opera_s1.productTypes.find((t) => t.apiValue === staticType),
      ]),
    );
    this.store$.dispatch(new filtersStore.SetEndDate(sensorDate));
    this.store$.dispatch(new searchStore.MakeSearch());
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

  public onSetDetailsOpen(event: Event) {
    this.detailsOpen = (event.target as HTMLDetailsElement).open;
  }

  public isRestrictedDataset(): boolean {
    return this.scene.dataset.includes('JERS-1');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
