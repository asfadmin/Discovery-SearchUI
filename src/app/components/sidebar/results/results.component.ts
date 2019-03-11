import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material';

import { Store } from '@ngrx/store';

import { SpreadsheetComponent } from './spreadsheet';
import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as queueStore from '@store/queue';

import * as models from '@models';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  public selectedGranule$ = this.store$.select(granulesStore.getSelectedGranule);
  public selectedProducts$ = this.store$.select(granulesStore.getSelectedGranuleProducts);

  public granules$ = this.store$.select(granulesStore.getGranules);

  constructor(
    private store$: Store<AppState>,
    private bottomSheet: MatBottomSheet,
  ) {}

  public onOpenSpreadsheet(): void {
    this.bottomSheet.open(SpreadsheetComponent, {
      panelClass: 'spreadsheet-width'
    });
  }

  public onNewGranuleSelected(name: string): void {
    this.store$.dispatch(new granulesStore.SetSelectedGranule(name));
  }

  public onNewQueueItem(product: models.Sentinel1Product): void {
    this.store$.dispatch(new queueStore.AddItem(product));
  }

  public onNewQueueItems(products: models.Sentinel1Product[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onQueueGranuleProducts(name: string): void {
    this.store$.dispatch(new queueStore.QueueGranule(name));
  }

  public onNewFocusedGranule(granule: models.Sentinel1Product): void {
    this.store$.dispatch(new granulesStore.SetFocusedGranule(granule));
  }

  public onClearFocusedGranule(): void {
    this.store$.dispatch(new granulesStore.ClearFocusedGranule());
  }
}
