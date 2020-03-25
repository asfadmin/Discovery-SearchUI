import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, tap, filter, } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';
import { getAllProducts, getScenes } from '@store/scenes/scenes.reducer';
import { getTemporalRange, getPerpendicularRange } from '@store/filters/filters.reducer';
import { getSearchType } from '@store/search/search.reducer';

import { criticalBaselineFor, CMRProduct, SearchType, Range } from '@models';

@Injectable({
  providedIn: 'root'
})
export class ScenesService {

  constructor(
    private store$: Store<AppState>,
  ) { }

  public products$(): Observable<CMRProduct[]> {
    return this.filterBaselineValues$(
      this.store$.select(getAllProducts)
    );
  }

  public scenes$(): Observable<CMRProduct[]> {
    return this.filterBaselineValues$(
      this.store$.select(getScenes)
    );
  }

  public filterBaselineValues$(products: Observable<CMRProduct[]>) {
    return combineLatest(
      products,
      this.store$.select(getTemporalRange),
      this.store$.select(getPerpendicularRange),
      this.store$.select(getSearchType)
    ).pipe(
      map(([scenes, tempRange, perpRange, searchType]) => {
        return (searchType === SearchType.BASELINE) ?
          scenes.filter(scene =>
            this.valInRange(scene.metadata.temporal, tempRange) &&
            this.valInRange(scene.metadata.perpendicular, perpRange)
          ) :
          scenes;
      })
    );
  }

  private valInRange(val: number | null, range: Range<number>): boolean {
    return (
      Number.isNaN(range.start) || range.start === null ||
      Number.isNaN(range.end) || range.end === null ||
      (val >= range.start && val <= range.end)
    );
  }
}
