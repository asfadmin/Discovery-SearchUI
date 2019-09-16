import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ScenesActionType, ScenesActions } from './scenes.action';

import { CMRProduct } from '@models';


interface SceneEntities { [id: string]: CMRProduct; }

export interface ScenesState {
  ids: string[];
  products: SceneEntities;
  areResultsLoaded: boolean;
  scenes: {[id: string]: string[]};

  selected: string | null;
  focused: string | null;
}

export const initState: ScenesState = {
  ids: [],
  scenes: {},
  products: {},
  areResultsLoaded: false,

  selected: null,
  focused: null,
};


export function scenesReducer(state = initState, action: ScenesActions): ScenesState {
  switch (action.type) {
    case ScenesActionType.SET_SCENES: {
      const products = action.payload
        .reduce((total, product) => {
          total[product.id] = product;

          return total;
        }, {});

      const productGroups: {[id: string]: string[]} = action.payload.reduce((total, product) => {
        const scene = total[product.groupId] || [];

        total[product.groupId] = [...scene, product.id];
        return total;
      }, {});

      const scenes: {[id: string]: string[]} = {};
      for (const [groupId, productNames] of Object.entries(productGroups)) {

        (<string[]>productNames).sort(
          (a, b) => products[a].bytes - products[b].bytes
        ).reverse();

        scenes[groupId] = Array.from(new Set(productNames)) ;
      }

      return {
        ...state,

        ids: Object.keys(products),
        selected: products[state.selected] ? products[state.selected].id : null,
        focused: null,

        areResultsLoaded: true,
        products,
        scenes
      };
    }

    case ScenesActionType.SET_SELECTED_SCENE: {
      return {
        ...state,
        selected: action.payload
      };
    }

    case ScenesActionType.SELECT_NEXT_SCENE: {
      const scenes = allScenesFrom(state);
      const scene = state.products[state.selected] || null;

      if (!scenes[0]) {
        return {
          ...state
        };
      }

      if (!scene) {
        const firstScene = scenes[0];

        return {
          ...state,
          selected: firstScene.id
        };
      }

      const currentSelected = scenes
        .filter(g => g.name === scene.name)
        .pop();

      const nextIdx = Math.min(
        scenes.indexOf(currentSelected) + 1,
        scenes.length - 1
      );

      const nextScene = scenes[nextIdx];

      return {
        ...state,
        selected: nextScene.id
      };
    }

    case ScenesActionType.SELECT_PREVIOUS_SCENE: {
      const scenes = allScenesFrom(state);
      const scene = state.products[state.selected] || null;

      if (!scenes[0]) {
        return {
          ...state
        };
      }

      if (!scene) {
        const lastScene = scenes[scenes.length - 1];

        return {
          ...state,
          selected: lastScene.id
        };
      }

      const currentSelected = scenes
        .filter(g => g.name === scene.name)
        .pop();

      const previousIdx = Math.max(scenes.indexOf(currentSelected) - 1, 0);
      const previousScene = scenes[previousIdx];

      return {
        ...state,
        selected: previousScene.id
      };
    }

    case ScenesActionType.SET_FOCUSED_SCENE: {
      return {
        ...state,
        focused: action.payload.id,
      };
    }

    case ScenesActionType.SET_RESULTS_LOADED: {
      return {
        ...state,
        areResultsLoaded: action.payload,
      };
    }

    case ScenesActionType.CLEAR_FOCUSED_SCENE: {
      return {
        ...state,
        focused: null,
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

export const allScenesFrom = (state: ScenesState) => {
  return Object.values(state.scenes)
    .map(group => {

      const browse = group
        .map(name => state.products[name])
        .filter(product => !product.browse.includes('error.png'))
        .pop();

      return browse ? browse : state.products[group[0]];
    });
};

export const getScenes = createSelector(
  getScenesState,
  (state: ScenesState) => allScenesFrom(state)
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

    if (!selected) {
      return;
    }

    const products = state.scenes[selected.groupId] || [];

    return products
      .map(id => state.products[id])
      .sort(function(a, b) {
        return a.bytes - b.bytes;
      }).reverse()
    ;
  }
);

export const getAreProductsLoaded = createSelector(
  getScenes,
  state => state.length > 0
);

export const getAllProducts = createSelector(
  getScenesState,
  state => Object.values(state.products)
);

export const getNumberOfProducts = createSelector(
  getAllProducts,
  products => products.length
);


export const getSceneProducts = createSelector(
  getScenesState,
  (state: ScenesState) => {
    const sceneProducts = {};

    Object.entries(state.scenes).forEach(
      ([sceneId, scene]) => {
        const products = scene
          .map(name => state.products[name]);

        sceneProducts[sceneId] = products;
      }
    );

    return sceneProducts;
  }
);

export const getSelectedScene = createSelector(
  getScenesState,
  (state: ScenesState) => state.products[state.selected] || null
);

export const getFocusedScene = createSelector(
  getScenesState,
  (state: ScenesState) => state.products[state.focused] || null
);
