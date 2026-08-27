import { NgClass, AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCardSmImage } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { filter, map, tap, debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { DownloadFileButtonComponent } from '@components/shared/download-file-button/download-file-button.component';
import { SceneMetadataComponent } from '@components/shared/scene-metadata/scene-metadata.component';
import * as models from '@models';
import { ReadableSizeFromBytesPipe } from '@pipes/readable-size-from-bytes.pipe';
import { ShortDateTimePipe, FullDatePipe } from '@pipes/short-date.pipe';
import { BrowseMapService, DatasetForProductService } from '@services';
import * as services from '@services/index';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import { BrowseListComponent } from './browse-list/browse-list.component';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
  providers: [BrowseMapService],
  imports: [
    NgClass,
    MatTooltip,
    MatIconButton,
    MatIcon,

    MatCardSmImage,
    MatProgressSpinner,
    SceneMetadataComponent,
    MatActionList,
    MatListItem,
    MatMenuTrigger,
    MatMenu,
    DownloadFileButtonComponent,
    MatMenuItem,
    BrowseListComponent,
    MatCheckbox,
    MatButton,
    AsyncPipe,
    ReadableSizeFromBytesPipe,
    ShortDateTimePipe,
    FullDatePipe,
    TranslateModule,
  ],
})
export class ImageDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  dialogRef = inject<MatDialogRef<ImageDialogComponent>>(MatDialogRef);
  private browseMap = inject(BrowseMapService);
  private datasetForProduct = inject(DatasetForProductService);
  private screenSize = inject(services.ScreenSizeService);

  public scene$ = this.store$.select(scenesStore.getSelectedScene);
  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);

  public masterOffsets$ = this.store$.select(scenesStore.getMasterOffsets);
  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public onlyShowScenesWithBrowse: boolean;
  public queuedProductIds: Set<string>;
  public scene: models.CMRProduct;
  public products: models.CMRProduct[];
  public dataset: models.Dataset;
  public isImageLoading = false;
  public isShow = false;
  public currentBrowse = null;
  public paramsList: any;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public breakpoint: models.Breakpoints = models.Breakpoints.FULL;

  private image: HTMLImageElement = new Image();
  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.breakpoint$.subscribe(
        (breakpoint) => (this.breakpoint = breakpoint),
      ),
    );
    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedSceneProducts)
        .subscribe((products) => {
          this.products = products;
        }),
    );

    this.subs.add(
      this.store$
        .select(uiStore.getOnlyScenesWithBrowse)
        .subscribe(
          (onlyBrowses) => (this.onlyShowScenesWithBrowse = onlyBrowses),
        ),
    );

    this.subs.add(
      this.store$
        .select(queueStore.getQueuedProductIds)
        .pipe(map((names) => new Set(names)))
        .subscribe(
          (queuedProducts) => (this.queuedProductIds = queuedProducts),
        ),
    );

    this.subs.add(
      this.scene$
        .pipe(
          filter((g) => !!g),
          tap((g) => (this.scene = g)),
          map((scene) => this.datasetForProduct.match(scene)),
        )
        .subscribe((dataset) => (this.dataset = dataset)),
    );
    this.subs.add(
      this.scene$.pipe(filter((prod) => !!prod?.metadata)).subscribe((prod) => {
        this.paramsList = this.jobParamsToList(prod.metadata);
      }),
    );
  }

  ngAfterViewInit() {
    this.subs.add(
      this.scene$
        .pipe(
          filter((scene) => !!scene),
          debounceTime(250),
        )
        .subscribe((scene) => {
          this.currentBrowse = scene.browses[0];
          this.loadBrowseImage(scene, this.currentBrowse);
        }),
    );
  }

  private loadBrowseImage(scene: models.CMRProduct, browse): void {
    this.isImageLoading = true;
    this.image = new Image();
    const browseService = this.browseMap;
    const currentScene = this.scene;
    const self = this;

    this.image.addEventListener('load', function () {
      if (currentScene !== scene) {
        return;
      }

      self.isImageLoading = false;

      // const wkt = scene.metadata.polygon;
      const [width, height] = [this.naturalWidth, this.naturalHeight];
      browseService.setBrowse(browse, { width, height });
    });

    this.image.src = browse;
  }

  public jobParamsToList(metadata) {
    if (!metadata.job) {
      return [];
    }

    const jobType = models.hyp3JobTypes[metadata.job.job_type];
    const options = jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    return options
      .filter((option) => metadata.job.job_parameters[option.apiName])
      .map((option) => {
        return {
          name: option.name,
          val: metadata.job.job_parameters[option.apiName],
        };
      });
  }
  public closeDialog() {
    this.dialogRef.close();
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
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

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(false));
  }
}
