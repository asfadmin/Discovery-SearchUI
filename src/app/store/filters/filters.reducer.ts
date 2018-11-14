import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FiltersActionType, FiltersActions } from './filters.action';
import { Platform, platforms, FilterType } from '../../models';

export interface FiltersState {
  selected: FilterType | undefined;
  platforms: PlatformsState;
}

export interface PlatformsState {
  entities: {[id: string]: Platform };
  selected: Set<string>;
}

const initState: FiltersState = {
  selected: undefined,
  platforms: {
    entities: platforms.reduce(
      (platformsObj, platform) => {
        platformsObj[platform.name] = platform;

        return platformsObj;
      },
      {}
    ),
    selected: new Set<string>([])
  }
};


export function filtersReducer(state = initState, action: FiltersActions): FiltersState {
  switch (action.type) {
    case FiltersActionType.ADD_SELECTED_PLATFORM: {
      const selected = new Set<string>(state.platforms.selected);
      selected.add(action.payload);

      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected
        }
      };
    }

    case FiltersActionType.REMOVE_SELECTED_PLATFORM: {
      const selected = new Set<string>(state.platforms.selected);
      selected.delete(action.payload);

      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected
        }
      };
    }

    case FiltersActionType.SET_SELECTED_FILTER: {
      const selected =  (state.selected !== action.payload) ?
        action.payload :
        undefined;

      return {
        ...state,
        selected
      };
    }

    default: {
      return state;
    }
  }
}

export const getFiltersState = createFeatureSelector<FiltersState>('filters');

export const getSelectedFilter = createSelector(
  getFiltersState,
  (state: FiltersState) => state.selected
);

export const getPlatforms = createSelector(
  getFiltersState,
  (state: FiltersState) => state.platforms
);

export const getPlatformsList = createSelector(
  getPlatforms,
  (state: PlatformsState) => Object.values(state.entities)
);

export const getSelectedPlatforms = createSelector(
  getPlatforms,
  (state: PlatformsState) => state.selected
);

