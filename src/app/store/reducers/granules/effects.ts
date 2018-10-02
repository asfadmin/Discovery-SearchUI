import { Injectable  } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../index';

import * as GranulesActions from './action';
const GranulesActionTypes = GranulesActions.GranulesActionTypes;

import { SentinelGranule } from '../../../models/sentinel-granule.model';


@Injectable()
export class GranulesEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<AppState>) {
    }

    @Effect()
    private load: Observable<Action> = this.actions$.
        ofType<GranulesActions.LoadGranules>(GranulesActionTypes.LOAD)
        .pipe(map(
            action => new GranulesActions.AddGranules([
                new SentinelGranule(
                    'SomeGranule',
                    'www.google.com',
                    'Up'
                )
            ])
        ));
}
