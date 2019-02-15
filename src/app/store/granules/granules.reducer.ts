import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GranulesActionType, GranulesActions } from './granules.action';

import { Sentinel1Product } from '@models';


interface GranuleEntities { [id: string]: Sentinel1Product; }

export interface GranulesState {
  ids: string[];
  products: GranuleEntities;
  granules: {[id: string]: string[]};

  selected: string | null;
  focused: string | null;

  searchList: string[];
}

const initState: GranulesState = {
  ids: [],
  granules: {},
  products: {},

  selected: null,
  focused: null,

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

      const productGroups = action.payload.reduce((total, product) => {
        const granule = total[product.groupId] || [];

        total[product.groupId] = [...granule, product.file];
        return total;
      }, {});

      const granules = {};
      for (const [groupId, productNames] of Object.entries(productGroups)) {

        (<string[]>productNames).sort(
          (a, b) => products[a].bytes - products[b].bytes
        ).reverse();

        granules[groupId] = productNames;
      }

      return {
        ...state,

        ids: Object.keys(products).sort(
          (a, b) => granules[a] - granules[b]
        ),
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

    case GranulesActionType.SET_FOCUSED_GRANULE: {
      return {
        ...state,
        focused: action.payload.name,
      };
    }

    case GranulesActionType.CLEAR_FOCUSED_GRANULE: {
      return {
        ...state,
        focused: null,
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

    if (!selected) {
      return;
    }

    const products = state.granules[selected.groupId] || [];

    return products
      .map(id => state.products[id])
      .sort(function(a, b) {
        return a.bytes - b.bytes;
      }).reverse()
    ;
  }
);

export const getGranuleProducts = createSelector(
  getGranulesState,
  (state: GranulesState) => {
    const granuleProducts = {};

    Object.entries(state.granules).forEach(
      ([granule, products]) => {

        granuleProducts[granule] = products
          .map(name => state.products[name]);
      }
    );

    return granuleProducts;
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

