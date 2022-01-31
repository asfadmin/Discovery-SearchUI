import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueueActionType, QueueActions } from './queue.action';
import { CMRProduct, QueuedHyp3Job, DownloadStatus } from '@models';

export interface ProductMap {
  [id: string]: CMRProduct;
}

export interface DownloadMap {
  [id: string]: DownloadStatus;
}
export interface QueueState {
  products: ProductMap;
  ids: string[];
  customJobs: QueuedHyp3Job[];
  downloads: DownloadMap;
  duplicates: number;
}

export const initState: QueueState = {
  products: {},
  ids: [],
  customJobs: [],
  downloads: {},
  duplicates: 0
};

export function queueReducer(state = initState, action: QueueActions): QueueState {
  switch (action.type) {

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
      let downloads = state.downloads;
      if (oldProducts[action.payload.id]) {
        const oldDownloads = {...state.downloads};
        downloads = remove_product(product, oldDownloads);
      }
      return {
        ...state,
        products,
        ids,
        downloads
      };
    }

    case QueueActionType.DOWNLOAD_PRODUCT: {
      const newDownload = action.payload;
      const downloads = {...state.downloads};
      downloads[newDownload.id] = newDownload;
      return {
        ...state
        , downloads
      };
    }
    case QueueActionType.REMOVE_DOWNLOAD_PRODUCT: {
      const toRemove = action.payload;
      const downloads = remove_product(toRemove, {...state.downloads});
      return {
        ...state,
        downloads
      };
    }
    case QueueActionType.REMOVE_ITEM: {
      const toRemove = action.payload;

      const products = remove_product(toRemove, {...state.products});

      const ids = Object.keys(products);

      const downloads = remove_product(toRemove, {...state.downloads});
      return {
        ...state,
        products,
        ids,
        downloads
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
      let downloads = {...state.downloads};
      toRemove.forEach(id => {
        console.log(id);
        downloads = remove_product(id, downloads);
      });

      return {
        ...state,
        products,
        ids,
        downloads
      };
    }

    case QueueActionType.CLEAR_QUEUE: {
      return {
        ...state,
        products: {},
        ids: [],
        downloads: {}
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
        customJobs: jobs,
        duplicates: isJobInQueue ? 1 : 0
      };
    }

    case QueueActionType.ADD_JOBS: {
      const jobs = [...state.customJobs];
      const new_jobs = [...action.payload];
      let _duplicates = 0;
      const jobsToQueue = new_jobs.filter(new_job =>
        !jobs.some(old_job => {
          const result = old_job.job_type === new_job.job_type &&
          sameGranules(old_job.granules, new_job.granules);
          if (result) {
            _duplicates += 1;
          }
          return result;
        }
        )
      );

      return {
        ...state,
        customJobs: [...jobs, ...jobsToQueue],
        duplicates: _duplicates
      };
    }

    case QueueActionType.REMOVE_JOB: {
      const queue = [...state.customJobs]
        .filter(job =>
          !(
            job.job_type.id === action.payload.job_type.id && (
              sameGranules(job.granules, action.payload.granules) ||
              sameGranuleNames(job.granules, action.payload.granules)
            )
          )
        );

      return {
        ...state,
        customJobs: queue
      };
    }

    case QueueActionType.REMOVE_JOBS: {
      let queue = [...state.customJobs];

      action.payload.forEach(queuedJob => {
        queue = queue.filter(job => {
          return !(
            job.job_type.id === queuedJob.job_type.id && (
              sameGranules(job.granules, queuedJob.granules) ||
              sameGranuleNames(job.granules, queuedJob.granules)
            )
          );
        }
        );
      });

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

const sameGranuleNames = (granules1: CMRProduct[], granules2: CMRProduct[]) => {
  const ids1 = new Set(granules1.map(granule => granule.name));
  const ids2 = new Set(granules2.map(granule => granule.name));

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

export const getDuplicates = createSelector(
  getQueueState,
  (state: QueueState) => state.duplicates
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

export const getDownloads = createSelector(
  getQueueState,
  (state: QueueState) => state.downloads
);
export const getDownloadIds = createSelector(
  getQueueState,
  (state: QueueState) => Object.keys(state.downloads)
);
