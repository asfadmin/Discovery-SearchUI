import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

import { GranulesState, granulesReducer } from './granuels.reducer';

export interface AppState {
    granules: GranulesState;
}

export const reducers: ActionReducerMap<AppState> = {
    granules: granulesReducer
};
