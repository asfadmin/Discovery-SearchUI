import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';
import { getScenes, getCustomPairs } from '@store/scenes/scenes.reducer';
import {
  getTemporalRange, getPerpendicularRange, getDateRange, DateRangeState, getSeason
} from '@store/filters/filters.reducer';

import { CMRProduct, CMRProductPair, ColumnSortDirection } from '@models';

@Injectable({
  providedIn: 'root'
})
export class PairService {

  constructor(private store$: Store<AppState>) { }

  public productsFromPairs$(): Observable<CMRProduct[]> {
    return this.pairs$().pipe(
      map(({ custom, pairs }) => {
        const prods = Array.from([...custom, ...pairs].reduce((products, pair) => {
          products.add(pair[0]);
          products.add(pair[1]);

          return products;
        }, new Set<CMRProduct>()));

        return prods;
      })
    );
  }

  public pairs$(): Observable<{custom: CMRProductPair[], pairs: CMRProductPair[]}> {
    return combineLatest(
      this.store$.select(getScenes).pipe(
        map(
          scenes => this.temporalSort(scenes, ColumnSortDirection.INCREASING)
        ),
      ),
      this.store$.select(getCustomPairs),
      this.store$.select(getTemporalRange).pipe(
        map(range => range.start)
      ),
      this.store$.select(getPerpendicularRange).pipe(
        map(range => range.start)
      ),
      this.store$.select(getDateRange),
      this.store$.select(getSeason),
    ).pipe(
      debounceTime(0),
      map(([scenes, customPairs, temporal, perp, dateRange, season]) => ({
        pairs: [...this.makePairs(scenes, temporal, perp, dateRange, season)],
        custom: [ ...customPairs ]
      })
      )
    );
  }

  private makePairs(scenes: CMRProduct[], tempThreshold: number, perpThreshold,
    dateRange: DateRangeState,
    season): CMRProductPair[] {
    const pairs = [];

    let startDateExtrema: Date;
    let endDateExtrema: Date;

    if (!!dateRange.start) {
    startDateExtrema = new Date(dateRange.start.toISOString());
    }
    if (!!dateRange.end) {
      endDateExtrema = new Date(dateRange.end.toISOString());
    }

    // }

    scenes.forEach((root, index) => {
      for (let i = index + 1; i < scenes.length; ++i) {
        const scene = scenes[i];
        const tempDiff = scene.metadata.temporal - root.metadata.temporal;
        const perpDiff = Math.abs(scene.metadata.perpendicular - root.metadata.perpendicular);

        const P1StartDate = new Date(root.metadata.date.toISOString());
        const P1StopDate = new Date(root.metadata.stopDate.toISOString());
        const P2StartDate = new Date(scene.metadata.date.toISOString());
        const P2StopDate = new Date(scene.metadata.stopDate.toISOString());

        // const p1DayOfYear = this.getDayOfYear(P1StartDate);
        // const p2DayOfYear = this.getDayOfYear(P2StopDate);

        if (!!season.start && !!season.end) {
          // if ( P1StartDate < P2StartDate) {
            if (!this.dayInSeason(P1StartDate, P1StopDate, P2StartDate, P2StopDate, season)) {
              return;
            }
        // } else {
        //   if (!this.dayInSeason(P2StartDate, P2StopDate, P1StartDate, P1StopDate, season)) {
        //     return;
        //   }
        // }
        }

        if (tempDiff > tempThreshold || perpDiff > perpThreshold) {
          return;
        }

        if (startDateExtrema !== null) {
          if (P1StartDate < startDateExtrema || P2StartDate < startDateExtrema) {
            return;
          }
        }

        if (endDateExtrema !== null) {
          if ( P1StopDate > endDateExtrema || P2StopDate > endDateExtrema) {
              return;
            }
        }

        pairs.push([root, scene]);
      }
    });

    return pairs;
  }

  private dayInSeason(P1StartDate: Date, P1EndDate: Date, P2StartDate: Date, P2EndDate: Date, season) {
    if (season.start < season.end) {
        return (
          season.start <= this.getDayOfYear(P1StartDate)
          && season.end >= this.getDayOfYear(P1EndDate)
          && season.start <= this.getDayOfYear(P2StartDate)
          && season.end >= this.getDayOfYear(P2EndDate)
        );
      } else {
        return !(
          season.start >= this.getDayOfYear(P1StartDate)
          && season.start >= this.getDayOfYear(P1EndDate)
          && season.end <= this.getDayOfYear(P1StartDate)
          && season.end <= this.getDayOfYear(P1EndDate)
          && season.start >= this.getDayOfYear(P2StartDate)
          && season.start >= this.getDayOfYear(P2EndDate)
          && season.end <= this.getDayOfYear(P2StartDate)
          && season.end <= this.getDayOfYear(P2EndDate)
        );
      }
  }

  private getDayOfYear(date: Date) {
    const temp = new Date(date.getFullYear(), 0, 0);
    return Math.floor(date.getTime() - temp.getTime()) / 1000 / 60 / 60 / 24;
  }

  private temporalSort(scenes, direction: ColumnSortDirection) {
    const sortFunc = (direction === ColumnSortDirection.INCREASING) ?
        (a, b) => a.metadata.temporal - b.metadata.temporal :
        (a, b) => b.metadata.temporal - a.metadata.temporal;

    return scenes.sort(sortFunc);
  }
}
