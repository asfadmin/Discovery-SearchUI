import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as userStore from '@store/user';

import * as models from '@models';
import {
  calibratedCrid,
  provisionalIssuesUrl,
  betaIssuesUrl,
} from '@models/datasets/nisar';

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
import { AsyncPipe, TitleCasePipe } from '@angular/common';
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
    AsyncPipe,
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
  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);
  public dataset: models.Dataset;
  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public isLoggedIn = this.store$.selectSignal(userStore.getIsUserLoggedIn);
  public sceneLen: number;
  public p = models.Props;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isImageLoading = false;
  public browseIndex = 0;
  public masterOffsets$ = this.store$.select(scenesStore.getMasterOffsets);
  public asfWebsite = models.asfWebsite;
  public productTypeDocsUrl: string | null = null;

  // NISAR products processed with CRID 5023+ are provisional calibrated data;
  // earlier CRIDs remain labelled uncalibrated with the pre-calibration docs
  public nisarCalibration(): { label: string; url: string } | null {
    if (this.dataset?.id !== 'NISAR') {
      return null;
    }

    const crid = Number(
      this.scene?.metadata?.nisar?.crid?.replace(/\D/g, '') ?? '',
    );

    return crid >= calibratedCrid
      ? { label: 'PROVISIONAL', url: provisionalIssuesUrl }
      : { label: 'UNCALIBRATED', url: betaIssuesUrl };
  }

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
      this.screenSize.size$
        .pipe(map((size) => (size.width > 1750 ? 32 : 16)))
        .subscribe((len) => (this.sceneLen = len)),
    );

    const scene$ = this.store$.select(scenesStore.getSelectedScene).pipe(
      distinctUntilChanged(),
      tap((_) => (this.isImageLoading = true)),
    );

    this.subs.add(
      scene$.subscribe((scene) => {
        this.scene = scene;
        if (this.scene) {
          this.dataset = this.datasetForProduct.match(scene);

          if (this.dataset.id == 'NISAR') {
            this.productTypeDocsUrl = `https://nisar-docs.asf.alaska.edu/${this.scene.metadata.productType.toLowerCase()}/`;
          } else {
            this.productTypeDocsUrl = null;
          }
        }
      }),
    );

    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedSceneProducts)
        .subscribe((_) => {
          this.browseIndex = 0;
        }),
    );
  }

  public sceneHasBrowse() {
    return (
      !!this.scene.browses &&
      this.scene.browses.length > 0 &&
      !this.scene?.browses[0].includes('no-browse')
    );
  }

  public productHasSceneBrowses() {
    if (this.searchType() === this.searchTypes.CUSTOM_PRODUCTS) {
      return this.scene.metadata.job.scenes.some(
        (x) => !x.browses[0].includes('no-browse'),
      );
    }
    return false;
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

    this.mapService.setSelectedBrowse(url, wkt, this.scene);
  }

  public isRestrictedDataset(): boolean {
    return this.scene.dataset.includes('JERS-1');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
