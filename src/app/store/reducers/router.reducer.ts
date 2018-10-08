import { Params } from '@angular/router';

import {
    createFeatureSelector,
    createSelector,
} from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

export interface RouterStateUrl {
    url: string;
    params: Params;
    queryParams: Params;
}

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const getRouterUrlState = createSelector(
    getRouterState,
    (state: RouterReducerState<RouterStateUrl>) => state && state.state
);
