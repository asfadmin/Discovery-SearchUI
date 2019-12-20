import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { withLatestFrom, switchMap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as userActions from './user.action';
import * as userReducer from './user.reducer';

import * as services from '@services';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private userDataService: services.UserDataService,
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
      ([_, [userAuth, profile]]) => this.userDataService.setAttribute$(userAuth, 'profile', profile)
    )
  );
}
