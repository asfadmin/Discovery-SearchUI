import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as uiActions from './ui.action';

import { BannerApiService } from '../../services/banner-api.service';

@Injectable()
export class UIEffects {

  constructor(
    private bannerApi: BannerApiService,
    private actions$: Actions
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
}
