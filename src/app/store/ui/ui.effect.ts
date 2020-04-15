import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as uiActions from './ui.action';

import { MapService } from '../../services/map/map.service';
import { BannerApiService } from '../../services/banner-api.service';

@Injectable()
export class UIEffects {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private bannerApi: BannerApiService,
    private actions$: Actions
  ) {}

  loadBanners = createEffect(() => this.actions$.pipe(
    ofType<uiActions.LoadBanners>(uiActions.UIActionType.LOAD_BANNERS),
    switchMap(() => this.bannerApi.load().pipe(
      catchError(() => of({
        banners: [{
          text: 'Error loading notifications' ,
          type: 'error',
          target: [
            'vertex'
          ]
        }],
        systime: ''
      }))
    )),
    map(resp => new uiActions.AddBanners(resp.banners))
  ));
}
