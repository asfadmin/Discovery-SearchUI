import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { filter, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

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
  public scene: models.CMRProduct;
  public products: models.CMRProduct[];
  public dataset: models.Dataset;

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

    this.scene$.pipe(
      filter(g => !!g),
      tap(g => this.scene = g),
      map(scene => this.datasetForProduct.match(scene)),
    ).subscribe(dataset => this.dataset = dataset);
  }

  ngAfterViewInit() {
    this.scene$.pipe(
      filter(scene => !!scene)
    ).subscribe(
      scene => {
        const img = new Image();
        const browseService = this.browseMap;

        img.addEventListener('load', function() {
          const [width, height] = [
            this.naturalWidth, this.naturalHeight
          ];
          browseService.setBrowse(scene.browse, {
            width, height
          });
        });
        img.src = scene.browse;
      }
    );
  }

  public onOpenImage(scene: models.CMRProduct) {
    window.open(scene.browse || 'assets/error.png');
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
}
