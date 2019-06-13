import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';


@Component({
  selector: 'app-dataset-selector',
  templateUrl: './dataset-selector.component.html',
  styleUrls: ['./dataset-selector.component.scss']
})
export class DatasetSelectorComponent implements OnInit {
  public datasets$ = this.store$.select(filtersStore.getDatasetsList);
  public selected: string | null = null;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.store$.select(filtersStore.getSelectedDatasetName).subscribe(
      selected => this.selected = selected
    );
  }

  public onSelectionChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedDataset(dataset));
  }
}
