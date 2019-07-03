import { Injectable } from '@angular/core';

import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private dataset: models.Dataset;

  constructor(private store$: Store<AppState>) {
    this.store$.select(filtersStore.getSelectedDataset).subscribe(
      p => this.dataset = p
    );
  }

  public isRelevant(prop: models.Props, dataset?: models.Dataset): boolean {
    const currentDataset = dataset || this.dataset;

    return currentDataset.properties.includes(prop);
  }
}
