import { Injectable } from '@angular/core';
import { Params, RouterStateSnapshot } from '@angular/router';
import {
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
} from '@ngrx/store';
import {
    StoreRouterConnectingModule,
    routerReducer,
    RouterReducerState,
    RouterStateSerializer,
} from '@ngrx/router-store';

import { environment } from '../../../environments/environment';
import { GranulesState, granulesReducer } from './granuels.reducer';


export interface RouterStateUrl {
    url: string;
    params: Params;
    queryParams: Params;
}

export interface AppState {
    granules: GranulesState;
    router: RouterReducerState<RouterStateUrl>;
}

export const getGranulesState = createFeatureSelector<GranulesState>('granules');

export const getGranules = createSelector(
    getGranulesState,
    (state: GranulesState) => state.ids.map(id => state.entities[id])
);

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const getRouterUrlState = createSelector(
    getRouterState,
    (state: RouterReducerState<RouterStateUrl>) => state && state.state
);

export const reducers: ActionReducerMap<AppState> = {
    granules: granulesReducer,
    router: routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];


@Injectable()
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        let route = routerState.root;

        while (route.firstChild) {
            route = route.firstChild;
        }

        const {
            url,
            root: { queryParams },
        } = routerState;
        const { params } = route;

        return { url, params, queryParams };
    }
}

