import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';
import {
  getAllProducts, getScenes, getTemporalSortDirection,
  getPerpendicularSortDirection, getCustomPairs, getScenesWithBrowse
} from '@store/scenes/scenes.reducer';
import {
  getTemporalRange, getPerpendicularRange, getDateRange
} from '@store/filters/filters.reducer';
import { getSearchType } from '@store/search/search.reducer';

import { CMRProduct, CMRProductPair, SearchType, Range, ColumnSortDirection } from '@models';

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

  public scenesWithBrowse$(): Observable<CMRProduct[]> {
    return this.filterBaselineValues$(
      this.store$.select(getScenesWithBrowse)
    );
  }

  public scenesSorted$(): Observable<CMRProduct[]> {
    return this.sortScenes$(
      this.scenes$()
    );
  }

  public scenesSortedWithBrowses$(): Observable<CMRProduct[]> {
    return this.sortScenes$(
      this.scenesWithBrowse$()
    );
  }

  private sortScenes$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest(
      scenes$,
      this.store$.select(getTemporalSortDirection),
      this.store$.select(getPerpendicularSortDirection)
    ).pipe(
      map(
        ([scenes, tempSort, perpSort]) => {
          if (tempSort === ColumnSortDirection.NONE && perpSort === ColumnSortDirection.NONE) {
            return scenes;
          }

          if (tempSort !== ColumnSortDirection.NONE) {
            return this.temporalSort(scenes, tempSort);
          } else {
            return this.perpendicularSort(scenes, perpSort);
          }
        }
      )
    );
  }

  private filterBaselineValues$(products: Observable<CMRProduct[]>) {
    return combineLatest(
      products,
      this.store$.select(getTemporalRange),
      this.store$.select(getPerpendicularRange),
      this.store$.select(getDateRange),
      this.store$.select(getSearchType),
    ).pipe(
      map(([scenes, tempRange, perpRange, dateRange, searchType]) => {
        return (searchType === SearchType.BASELINE) ?
          scenes.filter(scene =>
            this.valInRange(scene.metadata.temporal, tempRange) &&
            this.valInRange(scene.metadata.perpendicular, perpRange) &&
            this.dateInRange(scene.metadata.date, dateRange)
          ) :
          scenes;
      })
    );
  }

  private temporalSort(scenes, direction: ColumnSortDirection) {
    const sortFunc = (direction === ColumnSortDirection.INCREASING) ?
        (a, b) => a.metadata.temporal - b.metadata.temporal :
        (a, b) => b.metadata.temporal - a.metadata.temporal;

    return scenes.sort(sortFunc);
  }

  private perpendicularSort(scenes, direction: ColumnSortDirection) {
    const sortFunc = (direction === ColumnSortDirection.INCREASING) ?
        (a, b) => a.metadata.perpendicular - b.metadata.perpendicular :
        (a, b) => b.metadata.perpendicular - a.metadata.perpendicular;

    return scenes.sort(sortFunc);
  }

  private valInRange(val: number | null, range: Range<number>): boolean {
    return (
      Number.isNaN(range.start) || range.start === null ||
      Number.isNaN(range.end) || range.end === null ||
      (val >= range.start && val <= range.end)
    );
  }

  private dateInRange(date: moment.Moment, range: Range<Date | null>): boolean {
    return (
      this.after(date, range.start) &&
      this.before(date, range.end)
    );
  }

  private after(check: moment.Moment, pivot: Date | null): boolean {
    return (
      pivot === null ||
      check.isAfter(moment.utc(pivot))
    );
  }

  private before(check: moment.Moment, pivot: Date | null): boolean {
    return (
      pivot === null ||
      check.isBefore(moment.utc(pivot))
    );
  }
}
