import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueueActionType, QueueActions } from './queue.action';
import { Sentinel1Product } from '@models';


export interface QueueState {
  entities: {[id: string]: Sentinel1Product };
  ids: string[];
}

const initState: QueueState = {
  entities: {},
  ids: [],
};

export function queueReducer(state = initState, action: QueueActions): QueueState {
  switch (action.type) {
    case QueueActionType.ADD_ITEM: {
      return { ...state };
    }

    case QueueActionType.REMOVE_ITEM: {
      return { ...state };
    }

    case QueueActionType.CLEARN_QUEUE: {
      return { ...state };
    }

    default: {
      return state;
    }
  }
}

export const getQueueState = createFeatureSelector<QueueState>('queue');

export const getFullState = createSelector(
  getQueueState,
  (state: QueueState) => state
);
