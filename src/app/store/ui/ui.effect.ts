import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, first } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  withLatestFrom,
  tap,
} from 'rxjs/operators';

import { PreferencesComponent } from '@components/header/header-buttons/preferences/preferences.component';
import { SearchType } from '@models';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { getSearchType } from '@store/search/search.reducer';
import * as uiStore from '@store/ui';
import * as userStore from '@store/user';

import * as uiActions from './ui.action';
import { BannerApiService } from '../../services/banner-api.service';

@Injectable()
export class UIEffects {
  private bannerApi = inject(BannerApiService);
  private actions$ = inject(Actions);
  private store$ = inject<Store<AppState>>(Store);
  private dialog = inject(MatDialog);

  loadBanners = createEffect(() =>
    this.actions$.pipe(
      ofType<uiActions.LoadBanners>(uiActions.UIActionType.LOAD_BANNERS),
      switchMap(() =>
        this.bannerApi.load().pipe(
          catchError(() =>
            of({
              banners: [
                {
                  id: 'Error',
                  text: 'Error loading notifications',
                  name: 'Error',
                  type: 'error',
                },
              ],
              systime: '',
            }),
          ),
        ),
      ),
      map((resp) => new uiActions.AddBanners(resp.banners)),
    ),
  );

  storeCurrentFiltersOnPanelOpen = createEffect(
    () =>
      this.actions$.pipe(
        ofType<uiActions.ToggleFiltersMenu>(
          uiActions.UIActionType.TOGGLE_FILTERS_MENU,
        ),
        map((_) =>
          this.store$.dispatch(new filtersStore.StoreCurrentFilters()),
        ),
      ),
    { dispatch: false },
  );

  restorePreviousFiltersOnPanelClose = createEffect(
    () =>
      this.actions$.pipe(
        ofType<uiActions.CloseFiltersMenu>(
          uiActions.UIActionType.CLOSE_FILTERS_MENU,
        ),
        withLatestFrom(this.store$.select(getSearchType)),
        map(([_, searchType]) => {
          if (
            searchType !== SearchType.CUSTOM_PRODUCTS &&
            searchType !== SearchType.SBAS &&
            searchType !== SearchType.BASELINE
          ) {
            this.store$.dispatch(new filtersStore.RestoreFilters());
          }
        }),
      ),
    { dispatch: false },
  );

  openPreferencesMenu = createEffect(
    () =>
      this.actions$.pipe(
        ofType<uiActions.OpenPreferenceMenu>(
          uiActions.UIActionType.OPEN_PREFERENCE_MENU,
        ),
        tap((_) => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'open-preferences',
            'open-preferences': true,
          });

          const dialogRef = this.dialog.open(PreferencesComponent, {
            id: 'preferencesDialog',
            maxWidth: '100%',
            maxHeight: '100%',
          });

          dialogRef
            .afterClosed()
            .pipe(first())
            .subscribe((_) => {
              this.store$.dispatch(new userStore.SaveProfile());
              this.store$.dispatch(new uiStore.ClosePreferenceMenu());
            });
        }),
      ),
    { dispatch: false },
  );
}
