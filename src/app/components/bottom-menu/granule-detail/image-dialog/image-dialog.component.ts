import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';

import * as models from '@models';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit {
  public granule$ = this.store$.select(granulesStore.getSelectedGranule);
  public granule: models.CMRProduct;

  public granules$ = this.store$.select(granulesStore.getGranules);
  public granules:  models.CMRProduct[];

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<ImageDialogComponent>
  ) { }

  ngOnInit() {
    this.granule$.subscribe(g => this.granule = g);
    this.granules$.subscribe(gs => this.granules = gs);
  }

  public onOpenImage(granule: models.CMRProduct) {
    window.open(granule.browse || 'assets/error.png');
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public selectNextProduct(): void {
    if (!this.granule) {
      return;
    }

    const currentSelected = this.granules
      .filter(g => g.name === this.granule.name)
      .pop();

    const nextIdx = Math.min(
      this.granules.indexOf(currentSelected) + 1,
      this.granules.length - 1
    );

    const nextGranule = this.granules[nextIdx];

    this.store$.dispatch(new granulesStore.SetSelectedGranule(nextGranule.id));
  }

  public selectPreviousProduct(): void {
    if (!this.granule) {
      return;
    }

    const currentSelected = this.granules
      .filter(g => g.name === this.granule.name)
      .pop();

    const previousIdx = Math.max(this.granules.indexOf(currentSelected) - 1, 0);
    const previousGranule = this.granules[previousIdx];

    this.store$.dispatch(new granulesStore.SetSelectedGranule(previousGranule.id));
  }
}
