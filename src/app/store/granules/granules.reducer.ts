import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GranulesActionType, GranulesActions } from './granules.action';

import { Sentinel1Product } from '@models';


interface GranuleEntities { [id: string]: Sentinel1Product; }

export interface GranulesState {
  ids: string[];
  products: GranuleEntities;
  granules: {[id: string]: string[]};

  selected: string | null;

  loading: boolean;
  error: string | undefined;
}

const initState: GranulesState = {
  ids: [],
  granules: {},
  products: {},

  selected: null,

  loading: false,
  error: undefined,
};


export function granulesReducer(state = initState, action: GranulesActions): GranulesState {
  switch (action.type) {
    case GranulesActionType.SET_GRANULES: {
      const products = action.payload
        .reduce((total, product) => {
          total[product.file] = product;

          return total;
        }, {});

      const granules = action.payload.reduce((total, product) => {
        const granule = total[product.groupId] || [];

        total[product.groupId] = [...granule, product.file];
        return total;
      }, {});
      console.log(granules);

      return {
        ...state,
        loading: false,

        ids: Object.keys(products),
        products,
        granules

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
  (state: GranulesState) => {

    const data = Object.values(state.granules).map(group => {
      return state.products[group[0]];
    });
    console.log(data);
    return data;
  });

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
  (state: GranulesState) => state.products[state.selected]
);
