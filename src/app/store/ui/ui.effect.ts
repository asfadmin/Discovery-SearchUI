import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, first } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, tap } from 'rxjs/operators';
import * as uiActions from './ui.action';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';
import * as userStore from '@store/user';
import { getSearchType } from '@store/search/search.reducer';

import { BannerApiService } from '../../services/banner-api.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SearchType } from '@models';
import { PreferencesComponent } from '@components/header/header-buttons/preferences/preferences.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class UIEffects {

  constructor(
    private bannerApi: BannerApiService,
    private actions$: Actions,
    private store$: Store<AppState>,
    private dialog: MatDialog
  ) {}

  loadBanners = createEffect(() => this.actions$.pipe(
    ofType<uiActions.LoadBanners>(uiActions.UIActionType.LOAD_BANNERS),
    switchMap(() => this.bannerApi.load().pipe(
      catchError(() => of({
        banners: [{
          id: 'Error',
          text: 'Error loading notifications' ,
          name: 'Error',
          type: 'error'
        }],
        systime: ''
      }))
    )),
    tap(console.log),
    map(resp => new uiActions.AddBanners(resp.banners))
  ));

  storeCurrentFiltersOnPanelOpen = createEffect(() => this.actions$.pipe(
    ofType<uiActions.ToggleFiltersMenu>(uiActions.UIActionType.TOGGLE_FILTERS_MENU),
    map(_ => this.store$.dispatch(new filtersStore.StoreCurrentFilters()))
  ),
  { dispatch: false }
  );

  restorePreviousFiltersOnPanelClose = createEffect(() => this.actions$.pipe(
    ofType<uiActions.CloseFiltersMenu>(uiActions.UIActionType.CLOSE_FILTERS_MENU),
    withLatestFrom(this.store$.select(getSearchType)),
    map(([_, searchType]) => {
      if (searchType !== SearchType.SARVIEWS_EVENTS
        && searchType !== SearchType.CUSTOM_PRODUCTS
        && searchType !== SearchType.SBAS
        && searchType !== SearchType.BASELINE) {
        this.store$.dispatch(new filtersStore.RestoreFilters());
      }
    })
  ),
  { dispatch: false }
  );

  openPreferencesMenu = createEffect(() => this.actions$.pipe(
    ofType<uiActions.OpenPreferenceMenu>(uiActions.UIActionType.OPEN_PREFERENCE_MENU),
    tap(    _ => {window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'open-preferences',
        'open-preferences': true
      });

      const dialogRef = this.dialog.open(PreferencesComponent, {
        id: 'preferencesDialog',
        maxWidth: '100%',
        maxHeight: '100%'
      });

      dialogRef.afterClosed().pipe(
        first()
      ).subscribe(
          _ => {
            this.store$.dispatch(new userStore.SaveProfile());
            this.store$.dispatch(new uiStore.ClosePreferenceMenu());
        });
      })
    ),
    {dispatch: false}
  );

}
