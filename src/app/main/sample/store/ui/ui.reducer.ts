import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UIActionType, UIActions } from './ui.action';
import { FilterType } from '../../models/';

/* State */

export interface UIState {
  isFiltersMenuOpen: boolean;
  selectedFilter: FilterType | undefined;
}

const initState: UIState = {
  isFiltersMenuOpen: true,
  selectedFilter: FilterType.OTHER
};

/* Reducer */

export function uiReducer(state = initState, action: UIActions): UIState {
  switch (action.type) {
    case UIActionType.TOGGLE_FILTERS_MENU: {

      return {
          ...state,
          isFiltersMenuOpen: !state.isFiltersMenuOpen
        };
    }

    case UIActionType.CLOSE_FILTERS_MENU: {
      return {
        ...state,
          isFiltersMenuOpen: false
        };
    }

    case UIActionType.OPEN_FILTERS_MENU: {
      return {
        ...state,
          isFiltersMenuOpen: true
      };
    }

    case UIActionType.SET_SELECTED_FILTER: {
      return {
        ...state,
          selectedFilter: action.payload
        };
    }

    default: {
      return state;
    }
  }
}

/* Selectors */

export const getUIState = createFeatureSelector<UIState>('ui');

export const getFiltersMenuState = createSelector(
  getUIState,
  (state: UIState) => state
);

export const getSelectedFilter = createSelector(
  getFiltersMenuState,
  state => state.selectedFilter
);

export const getIsFiltersMenuOpen = createSelector(
  getFiltersMenuState,
  state => state.isFiltersMenuOpen
);
