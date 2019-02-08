import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueueActionType, QueueActions } from './queue.action';
import { Sentinel1Product } from '@models';


export interface QueueState {
  products: {[id: string]: Sentinel1Product };
  ids: string[];
}

const initState: QueueState = {
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

    case QueueActionType.REMOVE_ITEM: {
      const toRemove = action.payload;

      const products = { ...state.products };
      delete products[toRemove.file];

      const ids = [ ...state.ids ]
        .filter(id => id !== toRemove.file);

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
