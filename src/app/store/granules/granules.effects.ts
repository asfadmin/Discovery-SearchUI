import { Injectable  } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { AppState } from '../app.reducer';

import * as fromGranuleActions from './granules.action';
import { SentinelGranule } from '../../models';
import { AsfApiService } from '../../services';

@Injectable()
export class GranulesEffects {
    constructor(
        private asfapi: AsfApiService,
        private actions$: Actions) {
    }

    @Effect()
    private query: Observable<Action> = this.actions$
        .pipe(
            ofType<fromGranuleActions.QueryApi>(fromGranuleActions.GranulesActionTypes.QUERY),
            switchMap(action => this.asfapi.query(action.payload)
                .pipe(
                    map(setGranules),
                    catchError((err) => of(new fromGranuleActions.QueryError(
                        `Api Query failed to load results. ERROR: ${err['message']}`
                    )))
                )),
        );
}

const setGranules =
    resp => new fromGranuleActions.SetGranules(
        resp[0].map(
            g => new SentinelGranule(
                g['granuleName'],
                g['downloadUrl'],
                g['flightDirection'],
                g['stringFootprint']
            )
        )
    );

