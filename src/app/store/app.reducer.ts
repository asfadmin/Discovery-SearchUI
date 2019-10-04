import { Injectable } from '@angular/core';

import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '@environments/environment';
import { ScenesState, scenesReducer } from './scenes';
import { MapState, mapReducer } from './map';
import { FiltersState, filtersReducer } from './filters';
import { UIState, uiReducer } from './ui';
import { SearchState, searchReducer } from './search';
import { QueueState, queueReducer } from './queue';


export interface AppState {
  scenes: ScenesState;
  map: MapState;
  filters: FiltersState;
  ui: UIState;
  search: SearchState;
  queue: QueueState;
}

export const reducers: ActionReducerMap<AppState> = {
  scenes: scenesReducer,
  map: mapReducer,
  filters: filtersReducer,
  ui: uiReducer,
  search: searchReducer,
  queue: queueReducer,
};

export const metaReducers: MetaReducer<AppState>[] =
  !environment.production ?
  [] :
  [];
