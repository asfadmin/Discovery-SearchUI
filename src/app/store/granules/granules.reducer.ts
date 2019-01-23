import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Sentinel1Product } from '../../models';
import { GranulesActionType, GranulesActions } from './granules.action';

interface GranuleEntities { [id: string]: Sentinel1Product; }

export interface GranulesState {
  ids: string[];
  entities: GranuleEntities;

  loading: boolean;
  error: string | undefined;
}

const initState: GranulesState = {
  ids: [],
  entities: {},

  loading: false,
  error: undefined,
};


export function granulesReducer(state = initState, action: GranulesActions): GranulesState {
  switch (action.type) {
    case GranulesActionType.SET: {
      const totalGranules: GranuleEntities = {};

      for (const g of action.payload) {
        totalGranules[g.name] = g;
      }

      return {
        ...state,
        loading: false,

        ids: Object.keys(totalGranules),
        entities: totalGranules
      };
    }

    case GranulesActionType.QUERY: {
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    }

    case GranulesActionType.QUERY_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case GranulesActionType.CLEAR: {
      return initState;
    }

    default: {
      return state;
    }
  }
}


export const getGranulesState = createFeatureSelector<GranulesState>('granules');

export const getGranules = createSelector(
  getGranulesState,
  (state: GranulesState) => state.ids.map(id => state.entities[id])
);

export const getLoading = createSelector(
  getGranulesState,
  (state: GranulesState) => state.loading
);

export const getError = createSelector(
  getGranulesState,
  (state: GranulesState) => state.error
);
