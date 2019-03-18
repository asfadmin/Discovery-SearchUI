import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as granulesStore from '@store/granules';

import * as services from '@services';

import { SearchActionType, SearchResponse, SearchError } from './search.action';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private searchParams$: services.SearchParamsService,
    private asfApiService: services.AsfApiService,
    private productService: services.ProductService,
  ) {}

  @Effect()
  private makeSearches: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),

    withLatestFrom(this.searchParams$.getParams()),
    map(([_, params]) => params),
    switchMap(
      params => this.asfApiService.query<any[]>(params).pipe(
        map(response => new SearchResponse(response)),
        catchError(error => of(new SearchError(`${error.message}`))),
      )
    ),
  );

  @Effect()
  private searchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(action => this.productService.fromResponse(action.payload)),
    map(granule => new granulesStore.SetGranules(granule)),
  );
}
