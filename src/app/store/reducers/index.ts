import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

import { GranulesState, granulesReducer } from './granuels.reducer';

export const getGranulesState = createFeatureSelector<GranulesState>('granules');

export const getGranules = createSelector(
    getGranulesState,
    (state: GranulesState) => state.ids.map(id => state.entities[id])
);

export interface AppState {
    granules: GranulesState;
}

export const reducers: ActionReducerMap<AppState> = {
    granules: granulesReducer
};


