import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import * as fromGranuleActions from '../granules/granules.action';

@Injectable()
export class RouteEffects {

    constructor(private actions$: Actions) {}

    @Effect()
    private routeChanged: Observable<Action> = this.actions$
        .pipe(
            ofType<any>('ROUTER_NAVIGATION'),
            map(action => action.payload.routerState.queryParams),
            filter(isNonEmptyObject),
            map(paramsToQueryStr),
            map(query => new fromGranuleActions.QueryApi(query))
        );
}

const isNonEmptyObject = params => !!Object.keys(params).length;

const paramsToQueryStr = (params)  => {
    console.log(params);
    let paramStr = '';

    for (const [key, value] of Object.entries(params)) {
        paramStr += `${key}=${value}&`;
    }

    return paramStr.slice(0, -1);
};
