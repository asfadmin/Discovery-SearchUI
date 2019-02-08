import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueueActionType, QueueActions } from './queue.action';
import { Sentinel1Product } from '@models';


export interface QueueState {
  products: {[id: string]: Sentinel1Product };
  ids: string[];
}

const initState: QueueState = {
  products: {
    'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.iso.xml': {
      name: 'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8',
      file: 'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.iso.xml',
      downloadUrl: 'https://datapool.asf.alaska.edu/METADATA_SLC/SA/S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.iso.xml',
      bytes: 64956.6650390625,
      platform: 'Sentinel-1A',
      browse: 'assets/error.png',
      groupId: 'S1A_IWDV_0384_0390_025782_160',
      metadata: {
        date: new Date('2019-02-05T01:12:31.000Z'),
        polygon: 'POLYGON((-149.606369 61.734539,-149.061462 63.341347,-144.129715 62.904484,-144.930115 61.308559,-149.606369 61.734539))',
        productType: 'METADATA_SLC',
        beamMode: 'IW',
        polarization: 'VV+VH',
        flightDirection: 'DESCENDING',
        frequency: 'NA',
        path: 160,
        frame: 384,
        absoluteOrbit: 25782
      }
    },
    'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.zip': {
      name: 'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8',
      file: 'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.zip',
      downloadUrl: 'https://datapool.asf.alaska.edu/SLC/SA/S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.zip',
      bytes: 4281608626.3656616,
      platform: 'Sentinel-1A',
      browse: 'assets/error.png',
      groupId: 'S1A_IWDV_0384_0390_025782_160',
      metadata: {
        date: new Date('2019-02-05T01:12:31.000Z'),
        polygon: 'POLYGON((-149.606369 61.734539,-149.061462 63.341347,-144.129715 62.904484,-144.930115 61.308559,-149.606369 61.734539))',
        productType: 'SLC',
        beamMode: 'IW',
        polarization: 'VV+VH',
        flightDirection: 'DESCENDING',
        frequency: 'NA',
        path: 160,
        frame: 384,
        absoluteOrbit: 25782
      }
    },
  },
  ids: [
    'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.zip',
    'S1A_IW_SLC__1SDV_20190204T161231_20190204T161258_025782_02DE0A_DBD8.iso.xml'
  ],
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
