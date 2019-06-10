import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';

import { AppState } from '../app.reducer';

import * as services from '@services';

import { GranulesActionType, SetSelectedGranule } from './granules.action';
import * as uiStore from '@store/ui';

@Injectable()
export class GranulesEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
  ) {}

  @Effect()
  private openBottomMenuOnSearchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SetSelectedGranule>(GranulesActionType.SET_SELECTED),
    map(_ => new uiStore.OpenBottomMenu()),
  );
}
