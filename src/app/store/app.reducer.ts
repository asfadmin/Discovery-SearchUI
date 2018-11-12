import { Injectable } from '@angular/core';
import { Params, RouterStateSnapshot } from '@angular/router';

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import {
  routerReducer,
  RouterReducerState,
  RouterStateSerializer,
} from '@ngrx/router-store';

import { environment } from '../../environments/environment';
import { GranulesState, granulesReducer } from './granules';
import { RouterStateUrl } from './route';
import { MapState, mapReducer } from './map';
import { FiltersState, filtersReducer } from './filters';

export * from './route';
export * from './map';
export * from './granules';
export * from './filters';


export interface AppState {
  granules: GranulesState;
  router: RouterReducerState<RouterStateUrl>;
  map: MapState;
  filters: FiltersState;
}

export const reducers: ActionReducerMap<AppState> = {
  granules: granulesReducer,
  router: routerReducer,
  map: mapReducer,
  filters: filtersReducer
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
