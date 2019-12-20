import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';


@Component({
  selector: 'app-dataset-selector',
  templateUrl: './dataset-selector.component.html',
  styleUrls: ['./dataset-selector.component.scss']
})
export class DatasetSelectorComponent implements OnInit, OnDestroy {
  public datasets$ = this.store$.select(filtersStore.getDatasetsList);
  public selected: string | null = null;
  private datasetSub: Subscription;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.datasetSub = this.store$.select(filtersStore.getSelectedDatasetId).subscribe(
      selected => this.selected = selected
    );
  }

  public onSelectionChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.SetSelectedDataset(dataset));
  }

  ngOnDestroy() {
    this.datasetSub.unsubscribe();
  }
}
