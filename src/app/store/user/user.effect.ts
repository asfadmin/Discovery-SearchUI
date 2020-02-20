import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
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

  @Effect({ dispatch: false })
  private saveUserProfile: Observable<void> = this.actions$.pipe(
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
  );

  @Effect()
  private loadLoadUserProfile: Observable<Action> = this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_PROFILE),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'Profile')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(profile => new userActions.SetProfile(<models.UserProfile>profile))
  );

  @Effect({ dispatch: false })
  private saveSavedSearches: Observable<void> = this.actions$.pipe(
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
  );

  @Effect({ dispatch: false })
  private saveSearchHistory: Observable<void> = this.actions$.pipe(
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
  );

  @Effect()
  private loadSearchHistory: Observable<Action> = this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_SEARCH_HISTORY),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searchHistory => new userActions.SetSearchHistory(<models.Search[]>searchHistory))
  );

  @Effect()
  private loadSearchHistoryOnLogin: Observable<Action> = this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOGIN),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searchHistory => new userActions.SetSearchHistory(<models.Search[]>searchHistory))
  );

  @Effect()
  private loadSavedSearchesOnLogin: Observable<Action> = this.actions$.pipe(
    ofType<userActions.Login>(userActions.UserActionType.LOGIN),
    switchMap(
      (action) =>
        this.userDataService.getAttribute$(action.payload, 'SavedSearches')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searches => this.datesToDateObjectFor(searches)),
    map(searches => new userActions.SetSearches(<models.Search[]>searches))
  );

  @Effect()
  private loadSavedSearches: Observable<Action> = this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_SAVED_SEARCHES),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'SavedSearches')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searches => this.datesToDateObjectFor(searches)),
    map(searches => new userActions.SetSearches(<models.Search[]>searches))
  );

  private isSuccessfulResponse(resp): boolean {
    return !(
      !!resp &&
      'status' in resp &&
      resp['status'] === 'fail'
    );
  }

  private datesToDateObjectFor(searches): models.Search[] {
    return searches.map(search => {
      if (search.searchType === models.SearchType.LIST) {
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
}
