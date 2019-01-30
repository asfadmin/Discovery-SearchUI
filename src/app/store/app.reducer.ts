import { Injectable } from '@angular/core';

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '@environments/environment';
import { GranulesState, granulesReducer } from './granules';
import { MapState, mapReducer } from './map';
import { FiltersState, filtersReducer } from './filters';
import { UIState, uiReducer } from './ui';

export * from './map';
export * from './granules';
export * from './filters';
export * from './ui';


export interface AppState {
  granules: GranulesState;
  map: MapState;
  filters: FiltersState;
  ui: UIState;
}

export const reducers: ActionReducerMap<AppState> = {
  granules: granulesReducer,
  map: mapReducer,
  filters: filtersReducer,
  ui: uiReducer,
};

export const metaReducers: MetaReducer<AppState>[] =
  !environment.production ?
  [ storeFreeze ] :
  [];
