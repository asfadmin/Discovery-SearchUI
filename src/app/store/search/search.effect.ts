import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable, of, combineLatest } from 'rxjs';
import { map, withLatestFrom, switchMap, catchError, tap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { SetSearchAmount, EnableSearch, DisableSearch } from './search.action';
import * as granulesStore from '@store/granules';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as missionStore from '@store/mission';

import * as services from '@services';

import {
  SearchActionType,
  SearchResponse, SearchError, CancelSearch, SearchCanceled,
  MakeSearch
} from './search.action';
import { getIsCanceled, getSearchAmount } from './search.reducer';

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
    private historyService: services.HistoryService,
  ) {}

  @Effect({dispatch: false})
  private updateHistoryOnSearch: Observable<void> = this.actions$.pipe(
    ofType<MakeSearch>(SearchActionType.MAKE_SEARCH),
    withLatestFrom(this.searchState$()),
    map(([action, search]) => this.historyService.add(search))
  );

  @Effect()
  private clearMapInteractionModeOnSearch: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),
    map(action => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.NONE))
  );

  @Effect()
  private setCanSearch: Observable<Action> = this.actions$.pipe(
    ofType<SetSearchAmount>(SearchActionType.SET_SEARCH_AMOUNT),
    map(action =>
      (action.payload > 0) ? new EnableSearch() : new DisableSearch()
    )
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
        catchError(
          error => of(new SearchError(`Error loading search results`))
        )
      )
    ),
  );

  @Effect()
  private cancelSearchWhenFiltersCleared: Observable<Action> = this.actions$.pipe(
    ofType(
      filtersStore.FiltersActionType.CLEAR_DATASET_FILTERS,
      filtersStore.FiltersActionType.CLEAR_LIST_FILTERS,
      missionStore.MissionActionType.CLEAR_SELECTED_MISSION,
    ),
    map(_ => new CancelSearch())
  );

  @Effect()
  private searchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(action => this.productService.fromResponse(action.payload)),
    map(granule => new granulesStore.SetGranules(granule)),
  );

  @Effect()
  private hideSidebarOnSearchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.CloseSidebar()),
  );

  @Effect()
  private hideFilterMenuOnSearchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.CloseFiltersMenu()),
  );

  @Effect()
  private showBottomMenuOnSearchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(_ => new uiStore.OpenBottomMenu()),
  );

  private searchState$() {
    const params$ = this.store$.select(uiStore.getSearchType).pipe(
      switchMap(searchType => {
        const list$ = combineLatest(
          this.store$.select(filtersStore.getSearchList),
          this.store$.select(filtersStore.getListSearchMode),
        ).pipe(
          map(([list, type]) => ({ list, type }))
        );

        const filters$ = combineLatest(
          this.mapService.searchPolygon$,
          this.store$.select(filtersStore.getFiltersState),
          this.store$.select(missionStore.getSelectedMission),
        ).pipe(
          map(([polygon, filterState, mission]) => (
            { polygon, filterState, mission }
          ))
        );

        return {
          [models.SearchType.LIST]: list$,
          [models.SearchType.DATASET]: filters$
        }[searchType];
      }
    ));

    const amount$ = this.store$.select(getSearchAmount);

    return combineLatest(
      this.store$.select(uiStore.getSearchType),
      params$,
      amount$
    ).pipe(
      map(([type, params, results]) => ({ type, params, results })
    ));
  }
}
