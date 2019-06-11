import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';

import * as models from '@models';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent {
  public granule$ = this.store$.select(granulesStore.getSelectedGranule);

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<ImageDialogComponent>
  ) { }

  public onOpenImage(granule: models.CMRProduct) {
    window.open(granule.browse || 'assets/error.png');
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public selectNextProduct(): void {
    this.store$.dispatch(new granulesStore.SelectNextGranule());
  }

  public selectPreviousProduct(): void {
    this.store$.dispatch(new granulesStore.SelectPreviousGranule());
  }
}
