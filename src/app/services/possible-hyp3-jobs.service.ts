import { Injectable } from '@angular/core';

import { combineLatest, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';

import * as models from '@models';

import {
  ScenesService, PairService,
} from '@services';

@Injectable({
  providedIn: 'root'
})
export class PossibleHyp3JobsService {
  private products$ = this.scenesService.products$();
  public pairs$ = this.pairService.pairs$;

  private possibleProductJobs$ = this.products$.pipe(map(
    products => products.map(p => [p])
  ));

  private referenceScene$ = this.store$.select(scenesStore.getScenes).pipe(
    withLatestFrom(this.store$.select(scenesStore.getMasterName)),
    map(
      ([scenes, referenceName]) => {
        if (!!referenceName) {
          const referenceSceneIdx = scenes.findIndex(scene => scene.name === referenceName);

          if (referenceSceneIdx !== -1) {
            return scenes[referenceSceneIdx];
          }
        }
      }
    ));

  private hyp3ableJobsSBAS$ = combineLatest([
    this.pairService.productsFromPairs$.pipe(map(
    products => products.map(p => [p])
    )),
    this.pairs$,
  ]).pipe(
    map(([possibleJobs, {pairs, custom}]) => {
      const allPossiblePairJobs = [...pairs, ...custom];

      return allPossiblePairJobs.concat(possibleJobs);
    }));

  private hyp3ableJobsBaseline$ = combineLatest([
    this.products$,
    this.referenceScene$
  ]).pipe(
    map(([products, referenceScene]) => {
      if (!referenceScene) {
        return products.map(p => [p]);
      }

      const baselinePairs = this.makeBaselinePairs(products, referenceScene);
      return baselinePairs.concat(products.map(p => [p]));
    })
  );

  private makeBaselinePairs(products: models.CMRProduct[], referenceScene: models.CMRProduct) {
    products = products.filter(prod => prod.id !== referenceScene.id);

    const pairedJobs: models.CMRProduct[][] = products.map(product => {
      return [referenceScene, product]?.sort((a, b) => {
          if (a.metadata.date < b.metadata.date) {
            return -1;
          }
          return 1;
        })
    });

    return pairedJobs;
  }

  public possibleJobs$ = this.store$.select(searchStore.getSearchType).pipe(
    switchMap((searchType: models.SearchType) => {
      if (searchType === models.SearchType.DATASET || searchType === models.SearchType.LIST) {
        return this.possibleProductJobs$;
      }
      else if (searchType === models.SearchType.SBAS) {
        return this.hyp3ableJobsSBAS$;
      } else if (searchType === models.SearchType.BASELINE) {
        return this.hyp3ableJobsBaseline$;
      } else {
        return of([]);
      }
    })
  );

  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
    private pairService: PairService,
  ) { }
}
