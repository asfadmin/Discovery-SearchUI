import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';
import { getScenes, getCustomPairs } from '@store/scenes/scenes.reducer';
import {
  getTemporalRange, getPerpendicularRange
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
    ).pipe(
      map(([scenes, customPairs, temporal, perp]) => ({
        pairs: [...this.makePairs(scenes, temporal, perp)],
        custom: [ ...customPairs ]
      })
      )
    );
  }

  private makePairs(scenes: CMRProduct[], tempThreshold: number, perpThreshold): CMRProductPair[] {
    const pairs = [];

    scenes.forEach((root, index) => {
      for (let i = index + 1; i < scenes.length; ++i) {
        const scene = scenes[i];
        const tempDiff = scene.metadata.temporal - root.metadata.temporal;
        const perpDiff = Math.abs(scene.metadata.perpendicular - root.metadata.perpendicular);

        if (tempDiff > tempThreshold || perpDiff > perpThreshold) {
          return;
        }

        pairs.push([root, scene]);
      }
    });

    return pairs;
  }

  private temporalSort(scenes, direction: ColumnSortDirection) {
    const sortFunc = (direction === ColumnSortDirection.INCREASING) ?
        (a, b) => a.metadata.temporal - b.metadata.temporal :
        (a, b) => b.metadata.temporal - a.metadata.temporal;

    return scenes.sort(sortFunc);
  }
}
