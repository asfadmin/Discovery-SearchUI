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

      const products = add_product(newProduct, { ...state.products });

      const ids = Object.keys(products);

      return {
        ...state,
        products, ids
      };
    }

    case QueueActionType.ADD_ITEMS: {
      const newProducts = action.payload;

      const products = { ...state.products };

      newProducts.forEach(
        product => products[product.id] = product
      );

      const ids = Object.keys(products);

      return {
        ...state,
        products,
        ids
      };
    }

    case QueueActionType.TOGGLE_PRODUCT: {
      const product = action.payload;
      const oldProducts = { ...state.products };

      const products = (!oldProducts[action.payload.id]) ?
        add_product(product, oldProducts) :
        remove_product(product, oldProducts);

      const ids = Object.keys(products);

      return {
        ...state,
        products,
        ids
      };
    }

    case QueueActionType.REMOVE_ITEM: {
      const toRemove = action.payload;

      const products = remove_product(toRemove, {...state.products});

      const ids = Object.keys(products);

      return {
        ...state,
        products,
        ids
      };
    }

    case QueueActionType.REMOVE_ITEMS: {
      const toRemove = new Set(action.payload
        .map(product => product.id)
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

const add_product = (product, products) => ({
        ...products,
        [product.id]: product
      });

const remove_product = (toRemove, prods) => Object.keys(prods)
        .filter(productId => productId !== toRemove.id)
        .reduce(
          (total, productId) => {
          total[productId] = prods[productId];

          return total;
        }, {});


export const getQueueState = createFeatureSelector<QueueState>('queue');

export const getQueuedProducts = createSelector(
  getQueueState,
  (state: QueueState) => state.ids.reduce(
    (total, id) => [...total, state.products[id]]
    , []
  )
);

export const getQueuedProductIds = createSelector(
  getQueueState,
  (state: QueueState) => state.ids
);
