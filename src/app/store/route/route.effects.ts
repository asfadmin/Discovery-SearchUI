import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import * as fromGranuleActions from '../granules/granules.action';

@Injectable()
export class RouteEffects {

  constructor(private actions$: Actions) {}

  @Effect()
  private routeChanged: Observable<Action> = this.actions$
    .pipe(
      ofType<any>('ROUTER_NAVIGATION'),
      map(action => action.payload.routerState.queryParams),
      filter(params => !!Object.keys(params).length),
      map(params  => {
        let paramStr = '';

        for (const [key, value] of Object.entries(params)) {
          paramStr += `${key}=${value}&`;
        }

        return paramStr.slice(0, -1);
      }),
      map(query => new fromGranuleActions.QueryApi(query))
    );
}
