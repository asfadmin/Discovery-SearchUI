import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ScenesActionType, ScenesActions } from './scenes.action';

import {
  CMRProduct,
  ColumnSortDirection,
  opera_s1,
  CMRProductsById,
} from '@models';
import { createSceneArraySelector } from '@store/selectors';

export interface ScenesState {
  ids: string[];
  products: CMRProductsById;
  customPairIds: string[][];
  selectedPair: string[] | null;
  areResultsLoaded: boolean;
  scenes: Record<string, string[]>;
  timeseriesResults: any;
  selected: string | null;
  master: string | null;
  filterMaster: string | null;
  masterOffsets: {
    temporal: number;
    perpendicular: number;
  };
  perpendicularSort: ColumnSortDirection;
  temporalSort: ColumnSortDirection;
}

export const initState: ScenesState = {
  ids: [],
  scenes: {},
  customPairIds: [],
  selectedPair: null,
  products: {},
  areResultsLoaded: false,
  timeseriesResults: {},

  selected: null,
  master: null,
  filterMaster: null,
  masterOffsets: {
    temporal: 0,
    perpendicular: 0,
  },
  perpendicularSort: ColumnSortDirection.NONE,
  temporalSort: ColumnSortDirection.NONE,
};

export function scenesReducer(
  state = initState,
  action: ScenesActions,
): ScenesState {
  switch (action.type) {
    case ScenesActionType.SET_SCENES: {
      const subproducts: CMRProduct[] = [];

      let searchResults = action.payload.products.map((p) =>
        p.metadata.productType === 'BURST'
          ? ({
              ...p,
              productTypeDisplay: 'Single Look Complex (BURST)',
            } as CMRProduct)
          : p,
      );

      const ungrouped_product_types = [
        ...opera_s1.productTypes,
        { apiValue: 'BURST' },
        { apiValue: 'BURST_XML' },
      ].map((m) => m.apiValue);

      for (const product of searchResults) {
        if (product.metadata.subproducts.length > 0) {
          for (const subproduct of product.metadata.subproducts) {
            subproducts.push(subproduct);
          }
        }
      }

      searchResults = searchResults.concat(subproducts);

      const products = searchResults.reduce((total, product) => {
        if (
          product.isDummyProduct &&
          isAlreadyLoaded(product, state.products[product.id])
        ) {
          total[product.id] = state.products[product.id];

          return total;
        }

        total[product.id] = product;

        return total;
      }, {});

      let productGroups: Record<string, string[]> = {};
      const scenes: Record<string, string[]> = {};

      productGroups = searchResults.reduce((total, product) => {
        let groupCriteria = product.groupId;

        if (product.metadata.subproducts.length > 0) {
          groupCriteria = product.id;
        } else if (
          ungrouped_product_types.includes(product.metadata.productType) ||
          product.dataset === 'NISAR'
        ) {
          if (isSubProduct(product)) {
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
        (productNames as string[])
          .sort((a, b) => products[a].bytes - products[b].bytes)
          .reverse();

        scenes[groupId] = Array.from(new Set(productNames));
      }

      return {
        ...state,

        ids: Object.keys(products),

        areResultsLoaded: true,
        products,
        scenes,
      };
    }

    case ScenesActionType.ADD_CMR_DATA_TO_ON_DEMAND_JOBS: {
      const combinedProducts = action.payload;
      const products = { ...state.products };

      try {
        Object.values(combinedProducts).forEach((combinedProduct) => {
          products[combinedProduct.id] = combinedProduct as CMRProduct;
        });

        return {
          ...state,
          products,
        };
      } catch (error: any) {
        console.log(error);
        return { ...state };
      }
    }

    case ScenesActionType.UPDATE_PRODUCT_WITH_NEW_PROJECT_NAME: {
      const { productId, name } = action.payload;
      const products = { ...state.products };

      const toUpdate = products[productId];

      products[productId] = {
        ...toUpdate,
        metadata: {
          ...toUpdate.metadata,
          job: {
            ...toUpdate.metadata.job,
            name,
          },
        },
      };

      return { ...state, products };
    }

    case ScenesActionType.SET_SELECTED_SCENE: {
      return {
        ...state,
        selected: action.payload,
      };
    }

    case ScenesActionType.SET_SELECTED_PAIR: {
      return {
        ...state,
        selectedPair: action.payload,
      };
    }

    case ScenesActionType.SET_RESULTS_LOADED: {
      return {
        ...state,
        areResultsLoaded: action.payload,
      };
    }

    case ScenesActionType.SET_MASTER: {
      const newMaster = Object.values(state.products).filter(
        (product) => product.name === action.payload,
      )[0];

      return {
        ...state,
        master: action.payload,
        masterOffsets: {
          temporal: -newMaster.metadata.temporal,
          perpendicular: -newMaster.metadata.perpendicular,
        },
      };
    }

    case ScenesActionType.SET_FILTER_MASTER: {
      return {
        ...state,
        filterMaster: action.payload,
        master: action.payload,
      };
    }

    case ScenesActionType.CLEAR_BASELINE: {
      return {
        ...state,
        filterMaster: null,
        master: null,
        masterOffsets: {
          temporal: 0,
          perpendicular: 0,
        },
      };
    }

    case ScenesActionType.SET_PERPENDICULAR_SORT_DIRECTION: {
      return {
        ...state,
        perpendicularSort: action.payload,
      };
    }

    case ScenesActionType.SET_TEMPORAL_SORT_DIRECTION: {
      return {
        ...state,
        temporalSort: action.payload,
      };
    }

    case ScenesActionType.ADD_CUSTOM_PAIR: {
      const ids = action.payload;

      return {
        ...state,
        customPairIds: [...state.customPairIds, ids],
      };
    }

    case ScenesActionType.ADD_CUSTOM_PAIRS: {
      const ids = action.payload;

      return {
        ...state,
        customPairIds: [...state.customPairIds, ...ids],
      };
    }

    case ScenesActionType.REMOVE_CUSTOM_PAIR: {
      const toRemove = new Set(action.payload.map((product) => product.id));

      const pairs = [...state.customPairIds].filter((pair) => {
        const ids = new Set(pair);

        return !eqSet(toRemove, ids);
      });

      return {
        ...state,
        customPairIds: pairs,
        selectedPair: null,
      };
    }

    case ScenesActionType.CLEAR: {
      return initState;
    }

    default: {
      return state;
    }
  }
}

export const getScenesState = createFeatureSelector<ScenesState>('scenes');

export const allScenesFrom = (scenes: Record<string, string[]>, products) => {
  return Object.values(scenes).map((group) => {
    const browse = group
      .map((name) => products[name])
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

export const allScenesWithBrowse = (
  scenes: Record<string, string[]>,
  products,
) => {
  const withBrowses = allScenesFrom(scenes, products).filter(
    (scene) =>
      scene.browses.filter((browse) => !browse.includes('no-browse')).length >
      0,
  );

  return withBrowses;
};

export const getScenes = createSceneArraySelector(
  getScenesState,
  (state: ScenesState) => allScenesFrom(state.scenes, state.products),
);

export const getScenesWithBrowse = createSelector(
  getScenesState,
  (state: ScenesState) => allScenesWithBrowse(state.scenes, state.products),
);

export const getAreResultsLoaded = createSelector(
  getScenesState,
  (state: ScenesState) => state.areResultsLoaded,
);

export const getNumberOfScenes = createSelector(
  getScenes,
  (scenes: CMRProduct[]) => scenes.length,
);

export const getSelectedSceneProducts = createSelector(
  getScenesState,
  (state: ScenesState) => {
    const selected = state.products[state.selected];

    return productsForScene(selected, state);
  },
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
      (product) => (browses = [...browses, ...product.browses]),
    );

    const unique = Array.from(new Set(browses));

    return unique.length > 1
      ? unique.filter((b) => !b.includes('no-browse'))
      : unique;
  },
);

export const getSelectedOnDemandProductSceneBrowses = createSelector(
  getScenesState,
  (state: ScenesState) => {
    const selected = state.products[state.selected];

    if (!selected) {
      return;
    }

    const browses = [];

    const scenesForProduct = selected.metadata.job.scenes;
    for (const productScene of scenesForProduct) {
      browses.push(productScene.browses[0]);
    }

    return browses;
  },
);

const productsForScene = (
  selected: CMRProduct,
  state: ScenesState,
): CMRProduct[] => {
  if (!selected) {
    return;
  }

  let products = [];

  const ungrouped_product_types = [
    ...opera_s1.productTypes,
    { apiValue: 'BURST' },
    { apiValue: 'BURST_XML' },
  ].map((m) => m.apiValue);

  if (
    ungrouped_product_types.includes(selected.metadata.productType) ||
    selected.dataset === 'NISAR'
  ) {
    products = state.scenes[selected.metadata.parentID ?? selected.id] || [];
  } else {
    products = state.scenes[selected.groupId] || [];
  }

  return products
    .map((id) => state.products[id])
    .sort(function (a, b) {
      return a.bytes - b.bytes;
    })
    .reverse();
};

const isAlreadyLoaded = (product: CMRProduct, oldProduct: CMRProduct) => {
  return !!oldProduct && !oldProduct.isDummyProduct && product.isDummyProduct;
};

export const getAreProductsLoaded = createSelector(
  getScenes,
  (state) => state.length > 0,
);

export const getProducts = createSelector(
  getScenesState,
  (state) => state.products,
);

export const getAllProducts = createSelector(getScenesState, (state) =>
  Object.values(state.products),
);

export const getNumberOfProducts = createSelector(
  getAllProducts,
  (products) => products.length,
);

export const getAllSceneProducts = createSelector(
  getScenesState,
  (state: ScenesState) => {
    const allSceneProducts = {};

    Object.entries(state.scenes).forEach(([sceneId, scene]) => {
      const products = scene
        .map((name) => state.products[name])
        .filter((product) => {
          if (product.dataset === 'NISAR') {
            return (
              product.productTypeDisplay.includes('HDF5') &&
              !product.productTypeDisplay.includes('Statistics')
            );
          } else {
            return true;
          }
        });

      console.log(products);
      allSceneProducts[sceneId] = products;
    });

    return allSceneProducts;
  },
);

export const getSelectedScene = createSelector(
  getScenesState,
  (state: ScenesState) => state.products[state.selected] || null,
);

export const getMasterName = createSelector(
  getScenesState,
  (state) => state.master,
);

export const getFilterMaster = createSelector(
  getScenesState,
  (state) => state.filterMaster,
);

export const getMasterOffsets = createSelector(
  getScenesState,
  (state) => state.masterOffsets,
);

export const getTemporalExtrema = createSelector(getScenesState, (state) =>
  extrema(state.products, (product) => product.metadata.temporal),
);

export const getPerpendicularExtrema = createSelector(getScenesState, (state) =>
  extrema(state.products, (product) => product.metadata.perpendicular),
);

const extrema = (prods, keyFunc) => {
  const products = Object.values(prods);
  const nullRange = { min: null, max: null };

  if (products.length === 0) {
    return nullRange;
  }

  const vals: number[] = products.map(keyFunc);

  const range = {
    min: Math.min(...vals),
    max: Math.max(...vals),
  };

  return range.min === range.max ? nullRange : range;
};

export const getPerpendicularSortDirection = createSelector(
  getScenesState,
  (state) => state.perpendicularSort,
);

export const getTemporalSortDirection = createSelector(
  getScenesState,
  (state) => state.temporalSort,
);

export const getCustomPairIds = createSelector(
  getScenesState,
  (state) => state.customPairIds,
);

export const getCustomPairs = createSceneArraySelector(
  getScenesState,
  (state) =>
    state.customPairIds.map((pairIds) =>
      pairIds.map((id) => state.products[id]),
    ),
);

export const getSelectedPairIds = createSelector(
  getScenesState,
  (state) => state.selectedPair,
);

export const getSelectedPair = createSelector(getScenesState, (state) => {
  const selected = state.selectedPair;
  if (selected === null) {
    return selected;
  } else {
    return [state.products[selected[0]], state.products[selected[1]]];
  }
});

export const getIsSelectedPairCustom = createSelector(
  getScenesState,
  (state) => {
    const selectedPair = state.selectedPair;
    if (!selectedPair || !selectedPair[0]) {
      return false;
    }

    const selectedPairIds = new Set(selectedPair);

    return state.customPairIds.some((pairIds) => {
      const ids = new Set(pairIds);

      return eqSet(ids, selectedPairIds);
    });
  },
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
