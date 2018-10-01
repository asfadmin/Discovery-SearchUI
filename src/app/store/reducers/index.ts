import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { GranulesState, granulesReducer } from './granules/reducer';

export interface State {
    granules: GranulesState;
}

export const reducers: ActionReducerMap<State> = {
    granules: granulesReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
