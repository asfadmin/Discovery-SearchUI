import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '@environments/environment';
import { ScenesState, scenesReducer } from './scenes';
import { MapState, mapReducer } from './map';
import { FiltersState, filtersReducer } from './filters';
import { UIState, uiReducer } from './ui';
import { SearchState, searchReducer } from './search';
import { QueueState, queueReducer } from './queue';
import { UserState, userReducer } from './user';
import { Hyp3State, hyp3Reducer } from './hyp3';
import { chartsReducer, ChartsState } from './charts';


export interface AppState {
  scenes: ScenesState;
  map: MapState;
  filters: FiltersState;
  ui: UIState;
  search: SearchState;
  queue: QueueState;
  user: UserState;
  hyp3: Hyp3State;
  charts: ChartsState;
}

export const reducers: ActionReducerMap<AppState> = {
  scenes: scenesReducer,
  map: mapReducer,
  filters: filtersReducer,
  ui: uiReducer,
  search: searchReducer,
  queue: queueReducer,
  user: userReducer,
  hyp3: hyp3Reducer,
  charts: chartsReducer
};

export const metaReducers: MetaReducer<AppState>[] =
  !environment.production ?
  [] : [];
