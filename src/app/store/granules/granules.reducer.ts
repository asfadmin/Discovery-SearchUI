import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GranulesActionType, GranulesActions } from './granules.action';

import { Sentinel1Product } from '@models';


interface GranuleEntities { [id: string]: Sentinel1Product; }

export interface GranulesState {
  ids: string[];
  products: GranuleEntities;
  granules: {[id: string]: string[]};

  selected: string | null;

  searchList: string[];
}

const initState: GranulesState = {
  ids: [],
  granules: {},
  products: {},

  selected: null,

  searchList: [],
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

      return {
        ...state,

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

    case GranulesActionType.SET_SEARCH_LIST: {
      return {
        ...state,
        searchList: action.payload
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
    const data = Object.values(state.granules)
      .map(group => {
        return state.products[group[0]];
      });

    return data;
  });

export const getSelectedGranuleProducts = createSelector(
  getGranulesState,
  (state: GranulesState) => {
    const selected = state.products[state.selected];

    const products = state.granules[selected.groupId] || [];

    return products
      .map(id => state.products[id])
      .sort(function(a, b) {
        return a.bytes - b.bytes;
      }).reverse()
    ;
  }
);

export const getSelectedGranule = createSelector(
  getGranulesState,
  (state: GranulesState) => state.products[state.selected]
);

export const getSearchList = createSelector(
  getGranulesState,
  (state: GranulesState) => state.searchList
);

