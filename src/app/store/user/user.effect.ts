import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { combineLatest } from 'rxjs';
import { withLatestFrom, switchMap, map, filter, delay } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as userActions from './user.action';
import * as userReducer from './user.reducer';
import * as hyp3Store from '../hyp3/hyp3.action';
import { UserDataService } from '@services/user-data.service';
import * as models from '@models';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private store$ = inject<Store<AppState>>(Store);
  private userDataService = inject(UserDataService);

  public saveUserProfile = createEffect(
    () =>
      this.actions$.pipe(
        ofType<userActions.SaveProfile>(
          userActions.UserActionType.SAVE_PROFILE,
        ),
        withLatestFrom(
          combineLatest([
            this.store$.select(userReducer.getUserAuth),
            this.store$.select(userReducer.getUserProfile),
          ]),
        ),
        switchMap(([_, [userAuth, profile]]) =>
          this.userDataService.setAttribute$(userAuth, 'Profile', profile),
        ),
      ),
    { dispatch: false },
  );

  public loadLoadUserProfile = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.LoadSavedSearches>(
        userActions.UserActionType.LOAD_PROFILE,
      ),
      withLatestFrom(this.store$.select(userReducer.getUserAuth)),
      switchMap(([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'Profile'),
      ),
      map((resp) => {
        const defaultProfile = { ...userReducer.initState.profile };

        let profile = this.isValidProfile(resp)
          ? (resp as models.UserProfile)
          : defaultProfile;

        if (!profile.defaultFilterPresets) {
          profile = this.addDefaultFiltersToProfile(profile);
        }

        return profile;
      }),
      map(
        (profile) => new userActions.SetProfile(profile as models.UserProfile),
      ),
    ),
  );

  private addDefaultFiltersToProfile(
    profile: models.UserProfile,
  ): models.UserProfile {
    return {
      ...profile,
      defaultFilterPresets: {
        'Baseline Search': '',
        'Geographic Search': '',
        'SBAS Search': '',
        Displacement: '',
      },
    };
  }

  public saveSavedSearches = createEffect(
    () =>
      this.actions$.pipe(
        ofType<userActions.SaveSearches>(
          userActions.UserActionType.SAVE_SEARCHES,
        ),
        withLatestFrom(
          combineLatest([
            this.store$.select(userReducer.getUserAuth),
            this.store$.select(userReducer.getSavedSearches),
          ]),
        ),
        switchMap(([_, [userAuth, searches]]) =>
          this.userDataService.setAttribute$(
            userAuth,
            'SavedSearches',
            searches,
          ),
        ),
      ),
    { dispatch: false },
  );

  public saveSearchHistory = createEffect(
    () =>
      this.actions$.pipe(
        ofType<userActions.SaveSearches>(
          userActions.UserActionType.SAVE_SEARCH_HISTORY,
        ),
        withLatestFrom(
          combineLatest([
            this.store$.select(userReducer.getUserAuth),
            this.store$.select(userReducer.getSearchHistory),
          ]),
        ),
        filter(([_, [userAuth, _searches]]) => userAuth?.id !== null),
        switchMap(([_, [userAuth, searches]]) =>
          this.userDataService.setAttribute$(userAuth, 'History', searches),
        ),
      ),
    { dispatch: false },
  );

  public loadSearchHistory = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.LoadSavedSearches>(
        userActions.UserActionType.LOAD_SEARCH_HISTORY,
      ),
      withLatestFrom(this.store$.select(userReducer.getUserAuth)),
      switchMap(([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History'),
      ),
      filter((resp) => this.isSuccessfulResponse(resp)),
      map((searchHistory) => {
        const searches = this.updateSearchObjects(searchHistory);
        return new userActions.SetSearchHistory(searches as models.Search[]);
      }),
    ),
  );

  public loadSearchHistoryOnLogin = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOGIN),
      withLatestFrom(this.store$.select(userReducer.getUserAuth)),
      switchMap(([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History'),
      ),
      filter((resp) => this.isSuccessfulResponse(resp)),
      map((searchHistory) => {
        const searches = this.updateSearchObjects(searchHistory);
        return new userActions.SetSearchHistory(searches as models.Search[]);
      }),
    ),
  );

  private readonly loadSavedSearches$ = (userAuth: models.UserAuth) => {
    return this.userDataService.getAttribute$(userAuth, 'SavedSearches').pipe(
      filter((resp) => this.isSuccessfulResponse(resp)),
      map((searchesResp: any[]) => {
        const searches = this.updateSearchObjects(searchesResp);
        return new userActions.SetSearches(searches as models.Search[]);
      }),
    );
  };

  public loadSavedSearches = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.LoadSavedSearches>(
        userActions.UserActionType.LOAD_SAVED_SEARCHES,
      ),
      withLatestFrom(this.store$.select(userReducer.getUserAuth)),
      switchMap(([_, userAuth]) => this.loadSavedSearches$(userAuth)),
    ),
  );

  public loadSavedSearchesOnLogin = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.Login>(userActions.UserActionType.LOGIN),
      switchMap((action) => this.loadSavedSearches$(action.payload)),
    ),
  );

  public loadHyp3UserOnLogin = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOGIN),
      delay(400),
      map((_) => new hyp3Store.LoadUser()),
    ),
  );

  private isSuccessfulResponse(resp): boolean {
    try {
      return !(!!resp && 'status' in resp && resp['status'] === 'fail');
    } catch {
      return false;
    }
  }

  private updateSearchObjects(searches): models.Search[] {
    return searches?.map((search) => {
      const migrated = this.migrateSubtypesToPlatforms(search);

      if (
        migrated.searchType === models.SearchType.LIST ||
        !migrated.filters.dateRange
      ) {
        return migrated;
      }

      const { start, end } = migrated.filters.dateRange;
      return {
        ...migrated,
        filters: {
          ...migrated.filters,
          dateRange: {
            start: this.loadIfDate(start),
            end: this.loadIfDate(end),
          },
        },
      };
    });
  }

  private migrateSubtypesToPlatforms(search: any): any {
    if (!search.filters.subtypes) {
      return search;
    }
    const { subtypes, ...rest } = search.filters;
    return { ...search, filters: { ...rest, platforms: subtypes } };
  }

  private loadIfDate(date: string | null): Date | null {
    if (date === null) {
      return null;
    }

    const dateObj = new Date(date);

    return this.isValidDate(dateObj) ? dateObj : null;
  }

  private isValidDate = (d: Date): boolean =>
    d instanceof Date && !isNaN(d.valueOf());

  private isValidProfile(resp) {
    if (resp === null) {
      return false;
    }
    return (
      Object.values(models.MapLayerTypes).includes(resp.mapLayer) &&
      this.isNumber(resp.maxResults) &&
      resp.maxResults <= 5000
    );
  }

  private isNumber = (n) => !isNaN(n) && isFinite(n);
}
