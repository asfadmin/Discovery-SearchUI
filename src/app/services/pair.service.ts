import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { debounceTime, map, withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';
import { getScenes, getCustomPairs } from '@store/scenes/scenes.reducer';
import {
  getTemporalRange, getPerpendicularRange, getDateRange, DateRangeState, getSeason, getSBASOverlapThreshold
} from '@store/filters/filters.reducer';
import { getSearchType } from '@store/search/search.reducer';

import { CMRProduct, CMRProductPair, ColumnSortDirection, Range, SBASOverlap, SearchType } from '@models';

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
      this.store$.select(getTemporalRange),
      this.store$.select(getPerpendicularRange).pipe(
        map(range => range.start)
      ),
      this.store$.select(getDateRange),
      this.store$.select(getSeason),
      this.store$.select(getSBASOverlapThreshold),
    ).pipe(
      debounceTime(250),
      withLatestFrom(this.store$.select(getSearchType)),
      map(([params, searchType]) => {
        const [scenes, customPairs, temporal, perp, dateRange, season, sbasOverlapThreshold] = params;

        return searchType === SearchType.SBAS ? ({
          pairs: [...this.makePairs(scenes, temporal, perp, dateRange, season, sbasOverlapThreshold)],
          custom: [ ...customPairs ]
        }) : ({
          pairs: [],
          custom: []
        });
      })
    );
  }

  private makePairs(scenes: CMRProduct[], tempThreshold: Range<number>, perpThreshold,
    dateRange: DateRangeState,
    season,
    overlapThreshold: SBASOverlap): CMRProductPair[] {
    const pairs = [];

    let startDateExtrema: Date;
    let endDateExtrema: Date;

    if (!!dateRange.start) {
    startDateExtrema = new Date(dateRange.start.valueOf());
    }
    if (!!dateRange.end) {
      endDateExtrema = new Date(dateRange.end.valueOf());
    }


    const bounds = (x: string) => x.replace('POLYGON ', '').replace('((', '').replace('))', '').split(',').slice(0, 4).
    map(coord => coord.trimStart().split(' ')).
      map(coordVal => ({ lon: parseFloat(coordVal[0]), lat: parseFloat(coordVal[1])}));

    const calcCenter = (coords: {lat: number, lon: number}[]) => {
      const centroid = coords.reduce((acc, curr) => ({lat: acc.lat + curr.lat, lon: acc.lon + curr.lon}));
      centroid.lon = centroid.lon / 4.0;
      centroid.lat = centroid.lat / 4.0;
      return centroid;
    };

    scenes.forEach((root, index) => {
      for (let i = index + 1; i < scenes.length; ++i) {
        const scene = scenes[i];
        const tempDiff = scene.metadata.temporal - root.metadata.temporal;
        const perpDiff = Math.abs(scene.metadata.perpendicular - root.metadata.perpendicular);

        const orbitalDifference = scene.metadata.absoluteOrbit[0] - root.metadata.absoluteOrbit[0];

        const P1StartDate = new Date(root.metadata.date.toISOString());
        const P1StopDate = new Date(root.metadata.stopDate.toISOString());
        const P2StartDate = new Date(scene.metadata.date.toISOString());
        const P2StopDate = new Date(scene.metadata.stopDate.toISOString());

        if (orbitalDifference === 0) {
          return;
        }

        if (!!season.start && !!season.end) {
            if (!this.dayInSeason(P1StartDate, P1StopDate, P2StartDate, P2StopDate, season)) {
              return;
            }
        }

        if (tempDiff < tempThreshold.start || tempDiff > tempThreshold.end || perpDiff > perpThreshold) {
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

        if (overlapThreshold === SBASOverlap.HALF_OVERLAP) {
          const p1Bounds = bounds(root.metadata.polygon);
          const p2Bounds = bounds(scene.metadata.polygon);

          const p1Center = calcCenter(p1Bounds);

          if (
            p1Center.lat > Math.max(p2Bounds[0].lat, p2Bounds[1].lat) ||
            p1Center.lat < Math.min(p2Bounds[2].lat, p2Bounds[3].lat)
          ) {
            return;
          }
        } else if (overlapThreshold === SBASOverlap.ANY_OVERLAP) {
          const p1Bounds = bounds(root.metadata.polygon);
          const p2Bounds = bounds(scene.metadata.polygon);

          const p1LowToHight = p1Bounds.sort((a, b) => a.lat < b.lat ? -1 : 1);
          const p1Top = p1LowToHight.slice(2, p1Bounds.length);
          const p1Bottom = p1LowToHight.slice(0, 2);

          const p2LowToHight = p2Bounds.sort((a, b) => a.lat < b.lat ? -1 : 1);
          const p2Top = p2LowToHight.slice(2, p2Bounds.length);
          const p2Bottom = p2LowToHight.slice(0, 2);

          const p1Ymin = Math.min(p1Bottom[0].lat, p1Bottom[1].lat);
          const p1YMax = Math.max(p1Top[0].lat, p1Top[1].lat);

          const p2Ymin = Math.min(p2Bottom[0].lat, p2Bottom[1].lat);
          const p2YMax = Math.max(p2Top[0].lat, p2Top[1].lat);

          if (p1YMax < p2Ymin || p1Ymin > p2YMax) {
            return;
          }
        }

        pairs.push([root, scene]);
      }
    });

    return pairs;
  }

  public findNearestneighbour(reference_scene: CMRProduct,
    scenes: CMRProduct[],
    temporalRange: Range<number>,
    amount: number) {

    scenes = this.hyp3able(scenes);
    scenes = scenes.filter(scene =>
      scene.id.includes('SLC')
      && !scene.id.includes('METADATA')
      && scene.metadata.temporal != null
    );

    const totalDays = temporalRange.end - temporalRange.start;
    const ReftempDiffNormalized = (reference_scene.metadata.temporal - temporalRange.start) / totalDays;

    const SortedScenes = scenes.sort((a, b) => {

        const AtempDiffNormalized = (a.metadata.temporal - temporalRange.start) / totalDays;
        const BtempDiffNormalized = (b.metadata.temporal - temporalRange.start) / totalDays;

        if (Math.abs(AtempDiffNormalized - ReftempDiffNormalized) < Math.abs(BtempDiffNormalized - ReftempDiffNormalized)) {
          return -1;
        } else if (Math.abs(AtempDiffNormalized - ReftempDiffNormalized) === Math.abs(BtempDiffNormalized - ReftempDiffNormalized)) {
          return 0;
        }
        return 1;
      }
    );

    return SortedScenes.slice(0, Math.min(amount, SortedScenes.length));
  }

  private hyp3able(products: CMRProduct[]) {
    return products.filter(product => !product.metadata.polarization.includes('Dual'));
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
