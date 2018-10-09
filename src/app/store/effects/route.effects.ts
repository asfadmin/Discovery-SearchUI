import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { GranulesActions } from '../actions';

@Injectable()
export class RouteEffects {

    constructor(private actions$: Actions) {}

    @Effect()
    private routeChanged: Observable<Action> = this.actions$.
        ofType<any>('ROUTER_NAVIGATION')
        .pipe(
            map(action => action.payload.routerState.queryParams),
            filter(params => !!Object.keys(params).length),
            map(params => paramsToStr(params)),
            map(query => new GranulesActions.QueryApi(query)));
}


const paramsToStr = (params)  => {
    console.log(params);
    let paramStr = '';

    for (const [key, value] of Object.entries(params)) {
        paramStr += `${key}=${value}&`;
    }

    return paramStr.slice(0, -1);
};
