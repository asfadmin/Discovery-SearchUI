import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FiltersActionType, FiltersActions } from './filters.action';
import { Platform, platforms, FilterType } from '../../models';

export interface FiltersState {
  platforms: PlatformsState;
}

export interface PlatformsState {
  entities: {[id: string]: Platform };
  selected: Set<string>;
}

const initState: FiltersState = {
  platforms: {
    entities: platforms.reduce(
      (platformsObj, platform) => {
        platformsObj[platform.name] = platform;

        return platformsObj;
      },
      {}
    ),
    selected: new Set<string>(['Sentinel-1A'])
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

    case FiltersActionType.SET_SELECTED_PLATFORMS: {
      const selected = new Set(action.payload);

      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected
        }
      };
    }

    default: {
      return state;
    }
  }
}

export const getFiltersState = createFeatureSelector<FiltersState>('filters');

export const getPlatforms = createSelector(
  getFiltersState,
  (state: FiltersState) => state.platforms
);

export const getPlatformsList = createSelector(
  getPlatforms,
  (state: PlatformsState) => Object.values(state.entities)
);

export const getSelectedPlatformNames = createSelector(
  getPlatforms,
  (state: PlatformsState) => state.selected
);

export const getSelectedPlatforms = createSelector(
  getPlatforms,
  (state: PlatformsState) => Array.from(state.selected).reduce(
    (selected: Platform[], name: string) => [...selected, state.entities[name]],
    []
  )
);

