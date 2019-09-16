import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import * as models from '@models';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent {
  public scene$ = this.store$.select(scenesStore.getSelectedScene);

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<ImageDialogComponent>
  ) { }

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
