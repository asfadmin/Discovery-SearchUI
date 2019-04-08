import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as granulesStore from '@store/granules';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';

import * as services from '@services';

import {
  SearchActionType,
  SearchResponse, SearchError, CancelSearch, SearchCanceled
} from './search.action';
import { getIsCanceled } from './search.reducer';

import { MapInteractionModeType } from '@models';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private searchParams$: services.SearchParamsService,
    private asfApiService: services.AsfApiService,
    private productService: services.ProductService,
  ) {}

  @Effect()
  private clearMapInteractionModeOnSearch: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    map(action => new mapStore.SetMapInteractionMode(MapInteractionModeType.NONE))
  );


  @Effect()
  private makeSearches: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),

    withLatestFrom(this.searchParams$.getParams()),
    map(([_, params]) => params),
    switchMap(
      params => this.asfApiService.query<any[]>(params).pipe(
        withLatestFrom(this.store$.select(getIsCanceled)),
        map(([response, isCanceled]) =>
          !isCanceled ?  new SearchResponse(response) : new SearchCanceled()
        ),
        catchError(error => of(new SearchError(`${error.message}`))),
      )
    ),
  );

  @Effect()
  private cancelSearchWhenFiltersCleared: Observable<Action> = this.actions$.pipe(
    ofType(filtersStore.FiltersActionType.CLEAR_FILTERS),
    map(_ => new CancelSearch())
  );

  @Effect()
  private searchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(action => this.productService.fromResponse(action.payload)),
    map(granule => new granulesStore.SetGranules(granule)),
  );
}
