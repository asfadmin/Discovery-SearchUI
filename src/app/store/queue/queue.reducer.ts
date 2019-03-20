import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueueActionType, QueueActions } from './queue.action';
import { Sentinel1Product } from '@models';

export interface ProductMap {
  [id: string]: Sentinel1Product;
}

export interface QueueState {
  products: ProductMap;
  ids: string[];
}

export const initState: QueueState = {
  products: {},
  ids: [],
};

export function queueReducer(state = initState, action: QueueActions): QueueState {
  switch (action.type) {
    case QueueActionType.ADD_ITEM: {
      const newProduct = action.payload;

      const products = {
        ...state.products,
        [newProduct.file]:  newProduct
      };

      const ids = Array.from(
        new Set([...state.ids, newProduct.file])
      );

      return {
        ...state,
        products, ids
      };
    }

    case QueueActionType.ADD_ITEMS: {
      const newProducts = action.payload;

      const products = { ...state.products };

      newProducts.forEach(
        product => products[product.file] = product
      );

      const ids = Array.from(
        new Set([
          ...state.ids,
          ...newProducts.map(prod => prod.file)
        ])
      );

      return {
        ...state,
        products, ids
      };
    }

    case QueueActionType.REMOVE_ITEM: {
      const toRemove = action.payload;

      const prods = { ...state.products };
      const products = Object.keys(prods)
        .filter(product => product !== toRemove.file)
        .reduce(
          (total, product) => {
          total[product] = prods[product];

          return total;
        }, {});

      const ids = [ ...state.ids ]
        .filter(id => id !== toRemove.file);

      return {
        ...state,
        products, ids
      };
    }

    case QueueActionType.REMOVE_ITEMS: {
      const toRemove = new Set(action.payload
        .map(product => product.file)
      );


      const prods = { ...state.products };
      const products = Object.keys(prods)
        .filter(product => !toRemove.has(product))
        .reduce(
          (total, product) => {
          total[product] = prods[product];

          return total;
        }, {});

      const ids = [ ...state.ids ]
        .filter(id => !toRemove.has(id));

      return {
        ...state,
        products, ids
      };
    }

    case QueueActionType.CLEARN_QUEUE: {
      return initState;
    }

    default: {
      return state;
    }
  }
}

export const getQueueState = createFeatureSelector<QueueState>('queue');

export const getQueuedProducts = createSelector(
  getQueueState,
  (state: QueueState) => state.ids.reduce(
    (total, id) => [...total, state.products[id]]
    , []
  )
);
