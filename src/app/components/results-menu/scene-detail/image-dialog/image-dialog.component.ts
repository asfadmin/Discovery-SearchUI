import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { filter, map, tap, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import * as models from '@models';
import { BrowseMapService, DatasetForProductService } from '@services';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
  providers: [ BrowseMapService ]
})
export class ImageDialogComponent implements OnInit, AfterViewInit {
  public scene$ = this.store$.select(scenesStore.getSelectedScene);
  public queuedProductIds: Set<string>;
  public scene: models.CMRProduct;
  public products: models.CMRProduct[];
  public dataset: models.Dataset;
  public isImageLoading = false;
  public isShow = false;

  private image;

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    private browseMap: BrowseMapService,
    private datasetForProduct: DatasetForProductService
  ) { }

  ngOnInit() {
    this.store$.select(scenesStore.getSelectedSceneProducts).subscribe(
      products => this.products = products
    );

    this.store$.select(queueStore.getQueuedProductIds).pipe(
      map(names => new Set(names))
    ).subscribe(queuedProducts => this.queuedProductIds = queuedProducts);

    this.scene$.pipe(
      filter(g => !!g),
      tap(g => this.scene = g),
      map(scene => this.datasetForProduct.match(scene)),
    ).subscribe(dataset => this.dataset = dataset);
  }

  ngAfterViewInit() {
    this.scene$.pipe(
      filter(scene => !!scene),
      debounceTime(250)
    ).subscribe(
      scene => {
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

          browseService.setBrowse(scene.browses[0], {
            width, height
          });
        });

        this.image.src = scene.browses[0];
      }
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public selectNextProduct(): void {
    this.store$.dispatch(new scenesStore.SelectNextScene());
  }

  public selectPreviousProduct(): void {
    this.store$.dispatch(new scenesStore.SelectPreviousScene());
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }

  public toggleDisplay() {
    this.isShow = !this.isShow;
  }
}
