import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueueActionType, QueueActions } from './queue.action';
import { CMRProduct, QueuedHyp3Job } from '@models';

export interface ProductMap {
  [id: string]: CMRProduct;
}

export interface QueueState {
  products: ProductMap;
  ids: string[];
  customJobs: QueuedHyp3Job[];
}

export const initState: QueueState = {
  products: {},
  ids: [],
  customJobs: [],
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

    case QueueActionType.CLEAR_QUEUE: {
      return {
        ...state,
        products: {},
        ids: [],
      };
    }

    case QueueActionType.CLEAR_PROCESSING_QUEUE: {
      return {
        ...state,
        customJobs: [],
      };
    }

    case QueueActionType.CLEAR_PROCESSING_QUEUE_BY_JOB_TYPE: {
      const jobs = [...state.customJobs];
      const jobTypes = action.payload;

      const customJobs = jobs.filter(
        job => !jobTypes.has(job.job_type.id)
      );

      return {
        ...state,
        customJobs
      };
    }

    case QueueActionType.ADD_JOB: {
      const jobs = [...state.customJobs];

      const isJobInQueue = jobs.filter(job =>
        job.job_type === action.payload.job_type &&
        sameGranules(job.granules, action.payload.granules)
      ).length > 0;

      if (!isJobInQueue) {
        jobs.push(action.payload);
      }

      return {
        ...state,
        customJobs: jobs
      };
    }

    case QueueActionType.ADD_JOBS: {
      const jobs = [...state.customJobs];
      const new_jobs = [...action.payload];

      const jobsToQueue = new_jobs.filter(new_job =>
        !jobs.some(old_job =>
            old_job.job_type === new_job.job_type &&
            sameGranules(old_job.granules, new_job.granules)
        )
      );

      return {
        ...state,
        customJobs: [...jobs, ...jobsToQueue]
      };
    }

    case QueueActionType.REMOVE_JOB: {
      const queue = [...state.customJobs]
        .filter(job =>
          !(
            job.job_type === action.payload.job_type &&
            sameGranules(job.granules, action.payload.granules)
          )
        );

      return {
        ...state,
        customJobs: queue
      };
    }

    default: {
      return state;
    }
  }
}

const sameGranules = (granules1: CMRProduct[], granules2: CMRProduct[]) => {
  const ids1 = new Set(granules1.map(granule => granule.id));
  const ids2 = new Set(granules2.map(granule => granule.id));

  return eqSet(ids1, ids2);
};

function eqSet(a1, bs) {
  return a1.size === bs.size && all(isIn(bs), a1);
}

function all(pred, a1) {
  for (const a of a1)  {
    if (!pred(a)) {
      return false;
    }
  }
  return true;
}

function isIn(a1) {
  return function (a) {
    return a1.has(a);
  };
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

export const getQueuedJobs = createSelector(
  getQueueState,
  (state: QueueState) => state.customJobs
);

export const getQueuedJobTypes = createSelector(
  getQueueState,
  (state: QueueState) => {

    const jobTypeDict = state.customJobs
      .map(job => job.job_type)
      .reduce((jobTypes, jobType) => {
        jobTypes[jobType.id] = jobType;
        return jobTypes;
      }, {});

    return (<any>Object.values(jobTypeDict));
  }
);
