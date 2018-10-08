import { Injectable  } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { AppState } from '../index';

import { GranulesActions, GranulesActionTypes } from '../actions';
import { SentinelGranule } from '../../models/sentinel-granule.model';
import { AsfApiService } from '../../services/asf-api.service';

@Injectable()
export class GranulesEffects {
    constructor(
        private asfapi: AsfApiService,
        private actions$: Actions,
        private store$: Store<AppState>) {
    }

    @Effect()
    private load: Observable<Action> = this.actions$.
        ofType<GranulesActions.LoadGranules>(GranulesActionTypes.LOAD)
            .pipe(
            switchMap(action => this.asfapi.getGranules()),
            map(resp => resp[0]),
            map(granules => new GranulesActions.AddGranules(
                granules.map(
                    g => new SentinelGranule(
                        g['granuleName'],
                        g['downloadUrl'],
                        g['flightDirection']
                    )
                )
            ))
        );
}
