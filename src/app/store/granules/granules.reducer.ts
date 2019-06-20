import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GranulesActionType, GranulesActions } from './granules.action';

import { CMRProduct } from '@models';


interface GranuleEntities { [id: string]: CMRProduct; }

export interface GranulesState {
  ids: string[];
  products: GranuleEntities;
  granules: {[id: string]: string[]};

  selected: string | null;
  focused: string | null;
}

export const initState: GranulesState = {
  ids: [],
  granules: {},
  products: {},

  selected: null,
  focused: null,
};


export function granulesReducer(state = initState, action: GranulesActions): GranulesState {
  switch (action.type) {
    case GranulesActionType.SET_GRANULES: {
      const products = action.payload
        .reduce((total, product) => {
          total[product.id] = product;

          return total;
        }, {});

      const productGroups: {[id: string]: string[]} = action.payload.reduce((total, product) => {
        const granule = total[product.groupId] || [];

        total[product.groupId] = [...granule, product.id];
        return total;
      }, {});

      const granules: {[id: string]: string[]} = {};
      for (const [groupId, productNames] of Object.entries(productGroups)) {

        (<string[]>productNames).sort(
          (a, b) => products[a].bytes - products[b].bytes
        ).reverse();

        granules[groupId] = Array.from(new Set(productNames)) ;
      }

      return {
        ...state,

        ids: Object.keys(products),
        selected: null,
        focused: null,

        products,
        granules
      };
    }

    case GranulesActionType.SET_SELECTED_GRANULE: {
      return {
        ...state,
        selected: action.payload
      };
    }

    case GranulesActionType.SELECT_NEXT_GRANULE: {
      const granules = allGranulesFrom(state);
      const granule = state.products[state.selected] || null;

      if (!granule && granules[0]) {
        const firstGranule = granules[0];

        return {
          ...state,
          selected: firstGranule.id
        };
      } else if (!granules[0]) {
        return {
          ...state
        };
      }

      const currentSelected = granules
        .filter(g => g.name === granule.name)
        .pop();

      const nextIdx = Math.min(
        granules.indexOf(currentSelected) + 1,
        granules.length - 1
      );

      const nextGranule = granules[nextIdx];

      return {
        ...state,
        selected: nextGranule.id
      };
    }

    case GranulesActionType.SELECT_PREVIOUS_GRANULE: {
      const granules = allGranulesFrom(state);
      const granule = state.products[state.selected] || null;

      if (!granule && granules[granules.length - 1]) {
        const lastGranule = granules[granules.length - 1];

        return {
          ...state,
          selected: lastGranule.id
        };
      } else if (!granules[0]) {
        return {
          ...state
        };
      }


      const currentSelected = granules
        .filter(g => g.name === granule.name)
        .pop();

      const previousIdx = Math.max(granules.indexOf(currentSelected) - 1, 0);
      const previousGranule = granules[previousIdx];

      return {
        ...state,
        selected: previousGranule.id
      };
    }

    case GranulesActionType.SET_FOCUSED_GRANULE: {
      return {
        ...state,
        focused: action.payload.id,
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

export const allGranulesFrom = (state: GranulesState) => {
  return Object.values(state.granules)
    .map(group => {

      const browse = group
        .map(name => state.products[name])
        .filter(product => !product.browse.includes('error.png'))
        .pop();

      return browse ? browse : state.products[group[0]];
    });
};

export const getGranules = createSelector(
  getGranulesState,
  (state: GranulesState) => allGranulesFrom(state)
);

export const getNumberOfGranules = createSelector(
  getGranules,
  (granules: CMRProduct[]) => granules.length
);

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

export const getAreProductsLoaded = createSelector(
  getGranules,
  state => state.length > 0
);

export const getAllProducts = createSelector(
  getGranulesState,
  state => Object.values(state.products)
);

export const getGranuleProducts = createSelector(
  getGranulesState,
  (state: GranulesState) => {
    const granuleProducts = {};

    Object.entries(state.granules).forEach(
      ([granuleId, granule]) => {
        const products = granule
          .map(name => state.products[name]);

        granuleProducts[granuleId] = products;
      }
    );

    return granuleProducts;
  }
);

export const getSelectedGranule = createSelector(
  getGranulesState,
  (state: GranulesState) => state.products[state.selected] || null
);

export const getFocusedGranule = createSelector(
  getGranulesState,
  (state: GranulesState) => state.products[state.focused] || null
);
