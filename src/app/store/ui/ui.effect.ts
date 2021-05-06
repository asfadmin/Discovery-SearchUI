import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as uiActions from './ui.action';
import * as filtersStore from '@store/filters';

import { BannerApiService } from '../../services/banner-api.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

@Injectable()
export class UIEffects {

  constructor(
    private bannerApi: BannerApiService,
    private actions$: Actions,
    private store$: Store<AppState>,
  ) {}

  loadBanners = createEffect(() => this.actions$.pipe(
    ofType<uiActions.LoadBanners>(uiActions.UIActionType.LOAD_BANNERS),
    switchMap(() => this.bannerApi.load().pipe(
      catchError(() => of({
        banners: [{
          text: 'Error loading notifications' ,
          name: 'Error',
          type: 'error'
        }],
        systime: ''
      }))
    )),
    map(resp => new uiActions.AddBanners(resp.banners))
  ));

  storeCurrentFiltersOnPanelOpen = createEffect(() => this.actions$.pipe(
    ofType<uiActions.ToggleFiltersMenu>(uiActions.UIActionType.TOGGLE_FILTERS_MENU),
    map(_ => this.store$.dispatch(new filtersStore.StoreCurrentFilters()))
  ),
  { dispatch: false }
  );

  resstorePreviousFiltersOnPanelClose = createEffect(() => this.actions$.pipe(
    ofType<uiActions.CloseFiltersMenu>(uiActions.UIActionType.CLOSE_FILTERS_MENU),
    map(_ => this.store$.dispatch(new filtersStore.RestoreFilters()))
  ),
  { dispatch: false }
  );
}
