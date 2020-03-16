import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { withLatestFrom, switchMap, map, tap, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as userActions from './user.action';
import * as userReducer from './user.reducer';

import { UserDataService } from '@services/user-data.service';
import * as models from '@models';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private userDataService: UserDataService,
  ) {}

  private saveUserProfile = createEffect(() => this.actions$.pipe(
    ofType<userActions.SaveProfile>(userActions.UserActionType.SAVE_PROFILE),
    withLatestFrom(
      combineLatest(
        this.store$.select(userReducer.getUserAuth),
        this.store$.select(userReducer.getUserProfile)
      )
    ),
    switchMap(
      ([_, [userAuth, profile]]) =>
        this.userDataService.setAttribute$(userAuth, 'Profile', profile)
    )
  ), { dispatch: false });

  private loadLoadUserProfile = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_PROFILE),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'Profile')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    filter(resp => this.isValidProfile(resp)),
    map(profile => new userActions.SetProfile(<models.UserProfile>profile))
  ));

  private saveSavedSearches = createEffect(() => this.actions$.pipe(
    ofType<userActions.SaveSearches>(userActions.UserActionType.SAVE_SEARCHES),
    withLatestFrom(
      combineLatest(
        this.store$.select(userReducer.getUserAuth),
        this.store$.select(userReducer.getSavedSearches)
      )
    ),
    switchMap(
      ([_, [userAuth, searches]]) =>
        this.userDataService.setAttribute$(userAuth, 'SavedSearches', searches)
    ),
  ), { dispatch: false });

  private saveSearchHistory = createEffect(() => this.actions$.pipe(
    ofType<userActions.SaveSearches>(userActions.UserActionType.SAVE_SEARCH_HISTORY),
    withLatestFrom(
      combineLatest(
        this.store$.select(userReducer.getUserAuth),
        this.store$.select(userReducer.getSearchHistory)
      )
    ),
    switchMap(
      ([_, [userAuth, searches]]) =>
        this.userDataService.setAttribute$(userAuth, 'History', searches)
    ),
  ), { dispatch: false });

  private loadSearchHistory = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_SEARCH_HISTORY),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searchHistory => new userActions.SetSearchHistory(<models.Search[]>searchHistory))
  ));

  private loadSearchHistoryOnLogin = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOGIN),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searchHistory => new userActions.SetSearchHistory(<models.Search[]>searchHistory))
  ));

  private loadSavedSearchesOnLogin = createEffect(() => this.actions$.pipe(
    ofType<userActions.Login>(userActions.UserActionType.LOGIN),
    switchMap(
      (action) =>
        this.userDataService.getAttribute$(action.payload, 'SavedSearches')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searches => this.datesToDateObjectFor(searches)),
    map(searches => new userActions.SetSearches(<models.Search[]>searches))
  ));

  private loadSavedSearches = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_SAVED_SEARCHES),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'SavedSearches')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searches => this.datesToDateObjectFor(searches)),
    map(searches => new userActions.SetSearches(<models.Search[]>searches))
  ));

  private isSuccessfulResponse(resp): boolean {
    try {
      return !(
        !!resp &&
        'status' in resp &&
        resp['status'] === 'fail'
      );
    } catch {
      return false;
    }
  }

  private datesToDateObjectFor(searches): models.Search[] {
    return searches.map(search => {
      if (search.searchType === models.SearchType.LIST) {
        return search;
      }

      if (search.searchType === models.SearchType.BASELINE) {
        return search;
      }

      const { start, end } = search.filters.dateRange;

      search.filters.dateRange = {
        start: this.loadIfDate(start),
        end: this.loadIfDate(end)
      };

      return search;
    });

    return [];
  }

  private loadIfDate(date: string | null): Date | null {
    if (date === null) {
      return null;
    }

    const dateObj = new Date(date);

    return this.isValidDate(dateObj) ? dateObj : null;
  }

  private isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.valueOf());

  private isValidProfile(resp) {
    const datasetIds = models.datasetIds;

    return (
      datasetIds.includes(resp.defaultDataset) &&
      Object.values(models.MapLayerTypes).includes(resp.mapLayer) &&
      this.isNumber(resp.maxResults) && resp.maxResults <= 5000
    );
  }

  private isNumber = n => !isNaN(n) && isFinite(n);
}
