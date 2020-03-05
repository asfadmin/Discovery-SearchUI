import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BaselineActionType, BaselineActions } from './baseline.action';

/* State */

export interface BaselineState {
  master: string | null;
  filterMaster: string | null;
}

const initState: BaselineState = {
  master: null,
  filterMaster: null,
};

/* Reducer */

export function baselineReducer(state = initState, action: BaselineActions): BaselineState {
  switch (action.type) {
    case BaselineActionType.SET_MASTER: {
      return {
        ...state,
        master: action.payload
      };
    }

    case BaselineActionType.SET_FILTER_MASTER: {
      return {
        ...state,
        filterMaster: action.payload,
        master: action.payload
      };
    }

    case BaselineActionType.CLEAR_BASELINE: {
      return initState;
    }

    default: {
      return state;
    }
  }
}

/* Selectors */

export const getBaselineState = createFeatureSelector<BaselineState>('baseline');

export const getMasterId = createSelector(
  getBaselineState,
  state => state.master
);

export const getFilterMaster = createSelector(
  getBaselineState,
  state => state.filterMaster
);
