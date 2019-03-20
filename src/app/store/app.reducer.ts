import { Injectable } from '@angular/core';

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '@environments/environment';
import { GranulesState, granulesReducer } from './granules';
import { MapState, mapReducer } from './map';
import { FiltersState, filtersReducer } from './filters';
import { UIState, uiReducer } from './ui';
import { SearchState, searchReducer } from './search';
import { QueueState, queueReducer } from './queue';


export interface AppState {
  granules: GranulesState;
  map: MapState;
  filters: FiltersState;
  ui: UIState;
  search: SearchState;
  queue: QueueState;
}

export const reducers: ActionReducerMap<AppState> = {
  granules: granulesReducer,
  map: mapReducer,
  filters: filtersReducer,
  ui: uiReducer,
  search: searchReducer,
  queue: queueReducer,
};

export const metaReducers: MetaReducer<AppState>[] =
  !environment.production ?
  [ storeFreeze ] :
  [];
