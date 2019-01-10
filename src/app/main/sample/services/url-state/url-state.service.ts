import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, skip } from 'rxjs/operators';

import { AppState } from './../../store';
import * as granulesStore from './../../store/granules';
import * as mapStore from './../../store/map';
import * as uiStore from './../../store/ui';
import * as filterStore from './../../store/filters';

import * as models from './../../models';
import { urlParameters } from './url-params/url-params';

@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  public urlAppState: Subscription;
  private isNotLoaded = true;

  constructor(
    private store$: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  const urlAppState$ = combineLatest(
    this.store$.select(uiStore.getUIState),
    this.store$.select(filterStore.getSelectedPlatformNames),
    this.store$.select(mapStore.getMapState),
    this.activatedRoute.queryParams
  );

  urlAppState$.pipe(
      skip(1),
      map(state => {
        const params = state.pop();

        if (this.isNotLoaded) {
          this.isNotLoaded = false;
          this.loadStateFrom(params);
        }

        state.push(params);
        return state;
      }),
      map(state => {
        const [uiState, currentSelectedPlatforms, mapState, params] = state;

        return {
          ...uiState,
          ...mapState,
          mapCenter: urlParameters.mapCenter.toString(mapState.mapCenter),
          selectedPlatforms: urlParameters.selectedPlatforms.toString(currentSelectedPlatforms),
          granuleList: params.granuleList
        };
      })
    ).subscribe(
      queryParams => {
        this.router.navigate(['.'], { queryParams });
      }
    );
  }

  private loadStateFrom(params: Params): void {
    for (const urlParam of Object.values(urlParameters)) {
      const loadVal = params[urlParam.name()];

      if (!loadVal) {
        continue;
      }

      const action = urlParam.load(loadVal);

      if (!action) {
        continue;
      }

      this.store$.dispatch(action);
    }

    if (params.granuleList) {
      console.log(params.granuleList.split(',').length);
    }
  }
}
