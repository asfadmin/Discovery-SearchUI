import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { GranulesState, granulesReducer } from './granules/reducer';

export interface AppState {
    granules: GranulesState;
}

export const reducers: ActionReducerMap<AppState> = {
    granules: granulesReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
