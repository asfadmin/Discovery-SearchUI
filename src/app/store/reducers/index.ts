import { Injectable } from '@angular/core';
import { Params, RouterStateSnapshot } from '@angular/router';

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import {
    routerReducer,
    RouterReducerState,
    RouterStateSerializer,
} from '@ngrx/router-store';

import { environment } from '../../../environments/environment';
import { GranulesState, granulesReducer } from './granules.reducer';
import { RouterStateUrl } from './router.reducer';
export * from './router.reducer';
export * from './granules.reducer';


export interface AppState {
    granules: GranulesState;
    router: RouterReducerState<RouterStateUrl>;
}


export const reducers: ActionReducerMap<AppState> = {
    granules: granulesReducer,
    router: routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ?
        [ storeFreeze ] :
        [];


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
