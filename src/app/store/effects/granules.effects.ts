import { Injectable  } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { AppState } from '../index';

import { GranulesActions, GranulesActionTypes } from '../actions';
import { SentinelGranule } from '../../models/sentinel-granule.model';
import { AsfApiService } from '../../services/asf-api.service';

@Injectable()
export class GranulesEffects {
    constructor(
        private asfapi: AsfApiService,
        private actions$: Actions) {
    }

    @Effect()
    private query: Observable<Action> = this.actions$.
        ofType<GranulesActions.QueryApi>(GranulesActionTypes.QUERY)
        .pipe(
            switchMap(action => this.asfapi.query(action.payload).pipe(
                map(setGranules),
                catchError(() => of(new GranulesActions.QueryError('Api Query failed to load results.')))
            )),
        );
}

const setGranules =
    resp => new GranulesActions.SetGranules(
        resp[0].map(
            g => new SentinelGranule(
                g['granuleName'],
                g['downloadUrl'],
                g['flightDirection']
            )
        )
    );

