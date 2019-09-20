import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import * as models from '@models';
import { BrowseMapService } from '@services';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
  providers: [ BrowseMapService ]
})
export class ImageDialogComponent implements OnInit, AfterViewInit {
  public scene$ = this.store$.select(scenesStore.getSelectedScene);

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    private browseMap: BrowseMapService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.scene$.subscribe(
      scene => this.browseMap.setBrowse(scene.browse)
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
