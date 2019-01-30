import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GranulesActionType, GranulesActions } from './granules.action';

import { Sentinel1Product } from '@models';


interface GranuleEntities { [id: string]: Sentinel1Product; }

export interface GranulesState {
  ids: string[];
  entities: GranuleEntities;

  selected: string | null;

  loading: boolean;
  error: string | undefined;
}

const initState: GranulesState = {
  ids: [],
  entities: {},

  selected: null,

  loading: false,
  error: undefined,
};


export function granulesReducer(state = initState, action: GranulesActions): GranulesState {
  switch (action.type) {
    case GranulesActionType.SET_GRANULES: {
      const totalGranules = action.payload
        .reduce((total, granule) => {
          total[granule.name] = granule;

          return total;
        }, {});

      return {
        ...state,
        loading: false,

        ids: Object.keys(totalGranules),
        entities: totalGranules
      };
    }

    case GranulesActionType.SET_SELECTED: {
      return {
        ...state,
        selected: action.payload
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

export const getSelectedGranule = createSelector(
  getGranulesState,
  (state: GranulesState) => state.entities[state.selected]
);
