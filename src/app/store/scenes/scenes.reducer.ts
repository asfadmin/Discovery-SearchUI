import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ScenesActionType, ScenesActions } from './scenes.action';

import { CMRProduct, UnzippedFolder, ColumnSortDirection, SarviewsEvent, SarviewsProduct, opera_s1, Hyp3JobType } from '@models';
import { PinnedProduct } from '@services/browse-map.service';
import { createSelectorFactory, defaultMemoize  } from '@ngrx/store';

interface SceneEntities { [id: string]: CMRProduct; }

export interface ScenesState {
  ids: string[];
  products: SceneEntities;
  sarviewsEvents: SarviewsEvent[];
  selectedSarviewsID: string;
  selectedSarviewsProduct: SarviewsProduct;
  selectedSarviewsEventProducts: SarviewsProduct[];
  customPairIds: string[][];
  selectedPair: string[] | null;
  areResultsLoaded: boolean;
  scenes: {[id: string]: string[]};
  unzipped: {[id: string]: UnzippedFolder[]};
  openUnzippedProduct: string | null;
  productUnzipLoading: string | null;
  selected: string | null;
  master: string | null;
  filterMaster: string | null;
  masterOffsets: {
    temporal: number;
    perpendicular: number
  };
  perpendicularSort: ColumnSortDirection;
  temporalSort: ColumnSortDirection;

  pinnedProductBrowses: {[product_id in string]: PinnedProduct};
}

export const initState: ScenesState = {
  ids: [],
  scenes: {},
  customPairIds: [],
  sarviewsEvents: [],
  selectedSarviewsID: null,
  selectedSarviewsProduct: null,
  selectedSarviewsEventProducts: [],
  selectedPair: null,
  unzipped: {},
  productUnzipLoading: null,
  openUnzippedProduct: null,
  products: {},
  areResultsLoaded: false,

  selected: null,
  master: null,
  filterMaster: null,
  masterOffsets: {
    temporal: 0,
    perpendicular: 0
  },
  perpendicularSort: ColumnSortDirection.NONE,
  temporalSort: ColumnSortDirection.NONE,
  pinnedProductBrowses: {}
}


export function scenesReducer(state = initState, action: ScenesActions): ScenesState {
  switch (action.type) {
    case ScenesActionType.SET_SCENES: {
      let subproducts: CMRProduct[] = [];

      let searchResults = action.payload.products.map(p =>
        p.metadata.productType === 'BURST' ? ({
          ...p,
          productTypeDisplay: 'Single Look Complex (BURST)'
        }) as CMRProduct : p);

      const ungrouped_product_types = [
        ...opera_s1.productTypes,
        {apiValue: 'BURST'},
        {apiValue: 'BURST_XML'}
      ].map(m => m.apiValue)

      for (let product of searchResults) {
        if(product.metadata.subproducts.length > 0) {
          for (let subproduct of product.metadata.subproducts) {
            subproducts.push(subproduct)
          }
        }
      }

      searchResults = searchResults.concat(subproducts)

      const products = searchResults
      .reduce((total, product) => {
        if (product.isDummyProduct && isAlreadyLoaded(product, state.products[product.id])) {
          total[product.id] = state.products[product.id];

          return total;
        }

        total[product.id] = product;

        return total;
      }, {});

      let productGroups: {[id: string]: string[]} = {};
      let scenes: {[id: string]: string[]} = {};

      productGroups = searchResults.reduce((total, product) => {
        let groupCriteria = product.groupId;

        if (product.metadata.subproducts.length > 0) {
          groupCriteria = product.id;
        } else if(ungrouped_product_types.includes(product.metadata.productType)) {
          if(isSubProduct(product)) {
            groupCriteria = product.metadata.parentID;
          } else {
            groupCriteria = product.id;
          }
        }

        const scene = total[groupCriteria] || [];

        total[groupCriteria] = [...scene, product.id];
        return total;
      }, {});

      for (const [groupId, productNames] of Object.entries(productGroups)) {
        (<string[]>productNames).sort(
          (a, b) => products[a].bytes - products[b].bytes
        ).reverse();

        scenes[groupId] = Array.from(new Set(productNames)) ;
      }

      return {
        ...state,

        ids: Object.keys(products),

        areResultsLoaded: true,
        products,
        scenes,
        unzipped: {},
        productUnzipLoading: null,
        openUnzippedProduct: null
      };
    }

    case ScenesActionType.ADD_CMR_DATA_TO_ON_DEMAND_JOBS: {
      const cmrData = action.payload.reduce((products, product) => {
        products[product.name] = product;
        return products;
      }, {});

      const products = {...state.products};

      Object.values(products).forEach(jobProduct => {
        const product  = cmrData[jobProduct.name];

        if(!!product) {
          if (!jobProduct.metadata.job) {
            return;
          }
          let job = {
            ...jobProduct.metadata.job,
            job_parameters: {
              ...jobProduct.metadata.job?.job_parameters,
            }
          };
          const jobFile = !!job.files ?
            job.files[0] :
            { size: -1, url: '', filename: product.name };

          const scene_keys = job.job_parameters.granules;
          job.job_parameters.scenes = [];
          for (const scene_key of scene_keys) {
            job.job_parameters.scenes.push(cmrData[scene_key]);
          }

          const combinedProduct: any = {
            ...product,
            browses: job.browse_images ? job.browse_images : ['assets/no-browse.png'],
            thumbnail: job.thumbnail_images ? job.thumbnail_images[0] : 'assets/no-thumb.png',
            productTypeDisplay: `${job.job_type}, ${product.metadata.productType} `,
            downloadUrl: jobFile.url,
            bytes: jobFile.size,
            groupId: job.job_id,
            id: job.job_id,
            isDummyProduct: false,
            metadata: {
              ...product.metadata,
              fileName: jobFile.filename || '',
              productType: <Hyp3JobType>job.job_type,
              job
            },
          };

          products[combinedProduct.id] = <CMRProduct>combinedProduct;
        }
      });

      return {
        ...state,
        products
      };
    }

    case ScenesActionType.SET_SELECTED_SCENE: {
      return {
        ...state,
        selected: action.payload,
        productUnzipLoading: null,
        openUnzippedProduct: null
      };
    }

    case ScenesActionType.SET_SELECTED_PAIR: {
      return {
        ...state,
        selectedPair: action.payload,
        productUnzipLoading: null,
        openUnzippedProduct: null
      };
    }

    case ScenesActionType.SET_SELECTED_SARVIEWS_EVENT: {
      return {
        ...state,
        selectedSarviewsID: action.payload
      };
    }

    case ScenesActionType.SET_RESULTS_LOADED: {
      return {
        ...state,
        areResultsLoaded: action.payload,
      };
    }

    case ScenesActionType.SET_MASTER: {
      const newMaster = Object.values(state.products)
        .filter(product => product.name === action.payload)[0];

      return {
        ...state,
        master: action.payload,
        masterOffsets: {
          temporal: -newMaster.metadata.temporal,
          perpendicular: -newMaster.metadata.perpendicular
        }
      };
    }

    case ScenesActionType.SET_FILTER_MASTER: {
      return {
        ...state,
        filterMaster: action.payload,
        master: action.payload
      };
    }

    case ScenesActionType.CLEAR_BASELINE: {
      return {
        ...state,
        filterMaster: null,
        master: null,
        masterOffsets: {
          temporal: 0,
          perpendicular: 0
        }
      };
    }

    case ScenesActionType.OPEN_UNZIPPED_PRODUCT: {
      return {
        ...state,
        openUnzippedProduct: action.payload.id
      };
    }

    case ScenesActionType.LOAD_UNZIPPED_PRODUCT: {
      return {
        ...state,
        productUnzipLoading: action.payload.id,
        openUnzippedProduct: action.payload.id
      };
    }

    case ScenesActionType.ADD_UNZIPPED_PRODUCT: {
      const unzipped = { ...state.unzipped };
      const product = action.payload.product;

      unzipped[product.id] = action.payload.unzipped;

      return {
        ...state,
        unzipped,
        productUnzipLoading: null,
      };
    }

    case ScenesActionType.SET_PERPENDICULAR_SORT_DIRECTION: {
      return {
        ...state,
        perpendicularSort: action.payload
      };
    }

    case ScenesActionType.SET_TEMPORAL_SORT_DIRECTION: {
      return {
        ...state,
        temporalSort: action.payload
      };
    }

    case ScenesActionType.ERROR_LOADING_UNZIPPED: {
      return {
        ...state,
        productUnzipLoading: null,
        openUnzippedProduct: null
      };
    }

    case ScenesActionType.CLOSE_ZIP_CONTENTS: {
      return {
        ...state,
        openUnzippedProduct: null
      };
    }

    case ScenesActionType.ADD_CUSTOM_PAIR: {
      const ids = action.payload;

      return {
        ...state,
        customPairIds: [...state.customPairIds, ids]
      };
    }

    case ScenesActionType.ADD_CUSTOM_PAIRS: {
      const ids = action.payload;

      return {
        ...state,
        customPairIds: [...state.customPairIds, ...ids]
      };
    }

    case ScenesActionType.REMOVE_CUSTOM_PAIR: {
      const toRemove = new Set(action.payload.map(product => product.id));

      const pairs = [ ...state.customPairIds ].filter(pair => {
        const ids = new Set(pair);

        return !eqSet(toRemove, ids);
      });

      return {
        ...state,
        customPairIds: pairs,
        selectedPair: null ,
      };
    }

    case ScenesActionType.CLEAR: {
      return initState;
    }

    case ScenesActionType.SET_SARVIEWS_EVENTS: {
      return {
        ...state,
        sarviewsEvents: action.payload.events
      };
    }

    case ScenesActionType.SET_SARVIEWS_EVENT_PRODUCTS: {
      return {
        ...state,
        selectedSarviewsEventProducts: [...action.payload]
      };
    }

    case ScenesActionType.SET_SELECTED_SARVIEW_PRODUCT: {
      return {
        ...state,
        selectedSarviewsProduct: action.payload
      };
    }

    case ScenesActionType.SET_IMAGE_BROWSE_PRODUCTS: {
      return {
        ...state,
        pinnedProductBrowses: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getScenesState = createFeatureSelector<ScenesState>('scenes');

export const allScenesFrom = (scenes: {[id: string]: string[]}, products) => {
  return Object.values(scenes)
    .map(group => {

      const browse = group
      .map(name => products[name])
      .filter(hasNoBrowse)
      .pop();

      return browse ? browse : products[group[0]];
    });
};

const hasNoBrowse = (product) => {
  return (
    !!product.browses &&
      product.browses.length > 0 &&
      !product.browses[0].includes('no-browse.png')
  );
};

export const allScenesWithBrowse = (scenes: {[id: string]: string[]}, products) => {
  const withBrowses = allScenesFrom(scenes, products).filter(
    scene => scene.browses.filter(browse => !browse.includes('no-browse')).length > 0
  );

  return withBrowses;
};

function arrayEquals(a, b) {

  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, index) => {
      if(Array.isArray(value) && Array.isArray(b[index])) {
        return arrayEquals(value, b[index])
      } else {
        return b.findIndex((b_value) =>
        {
          return b_value?.id === value?.id && b_value.metadata.date === value.metadata.date
        }) >= 0
      }
    }
    )
}
export const createArraySelector =
createSelectorFactory(
  (projectionFn) =>
    defaultMemoize(
      projectionFn,
      arrayEquals,
      arrayEquals
    )
);

export const getScenes = createArraySelector(
  getScenesState,
  (state: ScenesState) => allScenesFrom(state.scenes, state.products)
);

export const getScenesWithBrowse = createSelector(
  getScenesState,
  (state: ScenesState) => allScenesWithBrowse(state.scenes, state.products)
);

export const getAreResultsLoaded = createSelector(
  getScenesState,
  (state: ScenesState) => state.areResultsLoaded
);

export const getNumberOfScenes = createSelector(
  getScenes,
  (scenes: CMRProduct[]) => scenes.length
);

export const getSelectedSceneProducts = createSelector(
  getScenesState,
  (state: ScenesState) => {
    const selected = state.products[state.selected];

    return productsForScene(selected, state);
  }
);

export const getSelectedSceneBrowses = createSelector(
  getScenesState,
  (state: ScenesState) => {
    const selected = state.products[state.selected];

    if (!selected) {
      return;
    }

    let browses = [];

    productsForScene(selected, state).forEach(
      product => browses = [...browses, ...product.browses]
    );

    const unique = Array.from(new Set(
      browses
    ));

    return unique.length > 1 ?
      unique.filter(b => !b.includes('no-browse')) :
      unique;
  }
);

export const getSelectedOnDemandProductSceneBrowses = createSelector (
  getScenesState,
  (state: ScenesState) => {
    const selected = state.products[state.selected];

    if (!selected) {
      return;
    }

    const browses = [];

    const scenesForProduct = selected.metadata.job.job_parameters.scenes;
    for (const productScene of scenesForProduct) {
      browses.push(productScene.browses[0]);
    }

    return browses;
  }
);

export const getSelectedSarviewsEventProductBrowses = createSelector (
  getScenesState,
  (state: ScenesState) => {
    const selected = state.selectedSarviewsEventProducts;

    if (!selected) {
      return;
    }

    const browses = selected.reduce((acc: string[], curr) => [...acc, curr.files.browse_url], []);

    return browses;
  }
);

const productsForScene = (selected, state) => {
  if (!selected) {
    return;
  }

  // const productTypes = Object.values(state.products).reduce((total, product: CMRProduct) => {
  //   total[product.metadata.productType] = product;

  //   return total;
  // }, {});

  let products = []

  const ungrouped_product_types = [...opera_s1.productTypes, {apiValue: 'BURST'}, {apiValue: 'BURST_XML'}].map(m => m.apiValue)
  // if (Object.keys(productTypes).length <= 2 && Object.keys(productTypes)[0] === 'BURST') {
  //   products = state.scenes[selected.name] || [];
  if(ungrouped_product_types.includes(selected.metadata.productType)) {
    products = state.scenes[selected.metadata.parentID ?? selected.id] || [];
  }
  else {
    products = state.scenes[selected.groupId] || []
  }

  return products
    .map(id => state.products[id])
    .sort(function(a, b) {
      return a.bytes - b.bytes;
    }).reverse();
};

const isAlreadyLoaded = (product, oldProduct) => {
  return !!oldProduct && !oldProduct.isDummyProduct && product.isDummyProduct;
}

export const getAreProductsLoaded = createSelector(
  getScenes,
  state => state.length > 0
);

export const getProducts = createSelector(
  getScenesState,
  state => state.products
);

export const getAllProducts = createSelector(
  getScenesState,
  state => Object.values(state.products)
);

export const getNumberOfProducts = createSelector(
  getAllProducts,
  products => products.length
);

export const getAllSceneProducts = createSelector(
  getScenesState,
  (state: ScenesState) => {
    const allSceneProducts = {};

    Object.entries(state.scenes).forEach(
      ([sceneId, scene]) => {
        const products = scene
        .map(name => state.products[name]);

        allSceneProducts[sceneId] = products;
      }
    );

    return allSceneProducts;
  }
);

export const getSelectedScene = createSelector(
  getScenesState,
  (state: ScenesState) => state.products[state.selected] || null
);

export const getSelectedSarviewsEvent = createSelector(
  getScenesState,
  (state: ScenesState) => state.sarviewsEvents.find(event => event.event_id === state.selectedSarviewsID) || null
);

export const getSelectedSarviewsProduct = createSelector(
  getScenesState,
  (state: ScenesState) => state.selectedSarviewsProduct
);

export const getUnzipLoading = createSelector(
  getScenesState,
  (state: ScenesState) => state.productUnzipLoading
);

export const getUnzippedProducts = createSelector(
  getScenesState,
  (state: ScenesState) => state.unzipped
);

export const getOpenUnzippedProduct = createSelector(
  getScenesState,
  (state: ScenesState) => state.products[state.openUnzippedProduct] || null
);

export const getShowUnzippedProduct = createSelector(
  getScenesState,
  (state: ScenesState) => state.openUnzippedProduct && !state.productUnzipLoading
);

export const getMasterName = createSelector(
  getScenesState,
  state => state.master
);

export const getFilterMaster = createSelector(
  getScenesState,
  state => state.filterMaster
);

export const getMasterOffsets = createSelector(
  getScenesState,
  state => state.masterOffsets
);

export const getTemporalExtrema = createSelector(
  getScenesState,
  state => extrema(
    state.products,
    product => product.metadata.temporal
  )
);

export const getPerpendicularExtrema = createSelector(
  getScenesState,
  state => extrema(
    state.products,
    product => product.metadata.perpendicular
  )
);

const extrema = (prods, keyFunc) => {
  const products = Object.values(prods);
  const nullRange = {min: null, max: null};

  if (products.length === 0) {
    return nullRange;
  }

  const vals: number[] = products.map(keyFunc);

  const range = {
    min: Math.min(...vals),
    max: Math.max(...vals)
  };

  return (range.min === range.max) ? nullRange : range;
};

export const getPerpendicularSortDirection = createSelector(
  getScenesState,
  state => state.perpendicularSort
);

export const getTemporalSortDirection = createSelector(
  getScenesState,
  state => state.temporalSort
);

export const getCustomPairIds = createSelector(
  getScenesState,
  state => state.customPairIds
);

export const getCustomPairs = createArraySelector(
  getScenesState,
  state => state.customPairIds.map(
    pairIds => pairIds.map(id => state.products[id])
  )
);

export const getSelectedPairIds = createSelector(
  getScenesState,
  state => state.selectedPair
);

export const getSelectedPair = createSelector(
  getScenesState,
  state => {
    const selected = state.selectedPair;
    if (selected === null) {
      return selected;
    } else {
      return [
        state.products[selected[0]],
        state.products[selected[1]]
      ];
    }
  }
);

export const getIsSelectedPairCustom = createSelector(
  getScenesState,
  state => {
    const selectedPair = state.selectedPair;
    if (!selectedPair || !selectedPair[0]) {
      return false;
    }

    const selectedPairIds = new Set(selectedPair);

    return state.customPairIds.some(pairIds => {
      const ids = new Set(pairIds);

      return eqSet(ids, selectedPairIds);
    });
  }
);

export const getSarviewsEvents = createSelector(
  getScenesState,
  state => state.sarviewsEvents
);

export const getNumberOfSarviewsEvents = createSelector(
  getSarviewsEvents,
  events => events.length
);

export const getSelectedSarviewsEventProducts = createSelector(
  getScenesState,
  state => {
    if (!!state.selectedSarviewsEventProducts) {
      const sorted = state.selectedSarviewsEventProducts.slice();
      return sorted.sort((a, b) => {
        if (a.granules[0].acquisition_date < b.granules[0].acquisition_date) {
          return 1;
        } else if (a.granules[0].acquisition_date > b.granules[0].acquisition_date) {
          return -1;
        }
        return 0;
      });
    }
    return state.selectedSarviewsEventProducts;
  }
);

export const getImageBrowseProducts = createSelector(
  getScenesState,
  state => {
    const output: {[product_id in string]: PinnedProduct} = Object.keys(state.pinnedProductBrowses).reduce(
      (out, product_id) => {
        const temp = out;
        temp[product_id] = {... state.pinnedProductBrowses[product_id]};
        return temp;
      }
      , {} as {[product_id in string]: PinnedProduct});

    return output;
  }
);

export const getPinnedEventBrowseIDs = createSelector(
  getScenesState,
  state => {
    return Object.keys(state.pinnedProductBrowses);
  }
);

function eqSet(aSet, bSet): boolean {
  if (aSet.size !== bSet.size) {
    return false;
  }

  for (const a of aSet) {
    if (!bSet.has(a)) {
      return false;
    }
  }

  return true;
}

function isSubProduct(product): boolean {
  return !!product.metadata.parentID;
}
