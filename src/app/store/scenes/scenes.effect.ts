import { Injectable } from '@angular/core';

import { map, withLatestFrom, switchMap, catchError, filter } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { AppState } from '../app.reducer';
import { ScenesActionType } from './scenes.action';

@Injectable()
export class ScenesEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
  ) {}

  private clearMapInteractionModeOnSearch = createEffect(() => this.actions$.pipe(
    ofType(ScenesActionType.LOAD_UNZIPPED_PRODUCT),
  ), { dispatch: false });
}
