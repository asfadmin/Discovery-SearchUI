import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '@environments/environment';

import { chartsReducer, ChartsState } from './charts';
import { FiltersState, filtersReducer } from './filters';
import { Hyp3State, hyp3Reducer } from './hyp3';
import { MapState, mapReducer } from './map';
import { QueueState, queueReducer } from './queue';
import { ScenesState, scenesReducer } from './scenes';
import { SearchState, searchReducer } from './search';
import { UIState, uiReducer } from './ui';
import { UserState, userReducer } from './user';

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
  charts: chartsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
