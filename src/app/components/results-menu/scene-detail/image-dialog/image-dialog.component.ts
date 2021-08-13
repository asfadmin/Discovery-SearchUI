import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import { filter, map, tap, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import * as models from '@models';
import { BrowseMapService, DatasetForProductService } from '@services';
import * as services from '@services/index';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
  providers: [ BrowseMapService ]
})
export class ImageDialogComponent implements OnInit, AfterViewInit, OnDestroy {
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

  private image: HTMLImageElement;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    private browseMap: BrowseMapService,
    private datasetForProduct: DatasetForProductService,
    private screenSize: services.ScreenSizeService
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(scenesStore.getSelectedSceneProducts).subscribe(
        products => this.products = products
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
        filter(prod => !!prod.metadata)
      ).subscribe( prod => {
        this.paramsList = this.jobParamsToList(prod.metadata);
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
  }

  private loadBrowseImage(scene, browse): void {
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
      const [width, height] = [
        this.naturalWidth, this.naturalHeight
      ];

      browseService.setBrowse(browse, {
        width, height
      });
    });

    this.image.src = browse;
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

  public toggleDisplay() {
    this.isShow = !this.isShow;
  }

  public setOnlyShowBrowse(isChecked: boolean) {
    this.store$.dispatch(new uiStore.SetOnlyScenesWithBrowse(isChecked));
  }

  public onNewBrowseSelected(scene, browse): void {
    this.loadBrowseImage(scene, browse);
  }

  public prodDownloaded( _product ) {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
