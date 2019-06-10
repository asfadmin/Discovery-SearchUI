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
  private platform: models.Platform;

  constructor(
    private store$: Store<AppState>,
  ) {
    this.store$.select(filtersStore.getSelectedPlatforms).pipe(
      map(ps => [...ps].pop()),
    ).subscribe(
      p => this.platform = p
    );
  }

  public isRelavent(prop: models.Props): boolean {
    return models.datasetProperties[prop].includes(this.platform.name);
  }
}
