import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable, of, forkJoin } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { SetSearchAmount, EnableSearch, DisableSearch, SetSearchType } from './search.action';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as baselineStore from '@store/baseline';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import * as services from '@services';
import { data } from '@services/baselines';


import {
  SearchActionType,
  SearchResponse, SearchError, CancelSearch, SearchCanceled
} from './search.action';
import { getIsCanceled } from './search.reducer';

import * as models from '@models';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private searchParams$: services.SearchParamsService,
    private asfApiService: services.AsfApiService,
    private productService: services.ProductService,
    private mapService: services.MapService,
  ) {}

  private clearMapInteractionModeOnSearch = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    map(action => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.NONE))
  ));

  private closeMenusWhenSearchIsMade = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    switchMap(action => [
      new uiStore.CloseFiltersMenu(),
      new uiStore.CloseAOIOptions()
    ])
  ));

  private setCanSearch = createEffect(() => this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_AMOUNT),
    map(action =>
      (action.payload > 0) ? new EnableSearch() : new DisableSearch()
    )
  ));

  private makeSearches = createEffect(() => this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    withLatestFrom(this.searchParams$.getParams()),
    map(([_, params]) => [params, {...params, output: 'COUNT'}]),
    switchMap(
      ([params, countParams]) => forkJoin(
        this.asfApiService.query<any[]>(params),
        of(10),
      ).pipe(
        withLatestFrom(this.store$.select(getIsCanceled)),
        map(([[response, totalCount], isCanceled]) =>
          !isCanceled ?
            new SearchResponse({ files: response, totalCount: +totalCount }) :
            new SearchCanceled()
        ),
        catchError(
          error => of(new SearchError(`Error loading search results`))
        )
      )
    ),
  ));

  private cancelSearchWhenFiltersCleared = createEffect(() => this.actions$.pipe(
    ofType(
      filtersStore.FiltersActionType.CLEAR_DATASET_FILTERS,
      filtersStore.FiltersActionType.CLEAR_LIST_FILTERS,
      filtersStore.FiltersActionType.CLEAR_SELECTED_MISSION,
      baselineStore.BaselineActionType.CLEAR_BASELINE,
    ),
    map(_ => new CancelSearch())
  ));

  private searchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    switchMap(action => [
      new scenesStore.SetScenes(
        this.productService.fromResponse(action.payload.files)
      ),
      new SetSearchAmount(action.payload.totalCount)
    ])
  ));

  private hideFilterMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.CloseFiltersMenu()),
  ));

  private showResultsMenuOnSearchResponse = createEffect(() => this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.OpenResultsMenu()),
  ));

  setMapInteractionModeBasedOnSearchType = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE),
    filter(action => action.payload === models.SearchType.DATASET),
    map(_ => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW))
  ));

  clearResultsWhenSearchTypeChanges = createEffect(() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE),
    switchMap(action => [
      new scenesStore.ClearScenes(),
      new uiStore.CloseAOIOptions(),
      action.payload === models.SearchType.LIST ?
        new uiStore.OpenFiltersMenu() :
        new uiStore.CloseFiltersMenu(),
    ])
  ));
}
