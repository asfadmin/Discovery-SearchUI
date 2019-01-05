import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UIActionType, UIActions } from './ui.action';
import { FilterType } from '../../models/';

/* State */

export interface UIState {
  filtersMenu: {
    isOpen: boolean
    selected: FilterType | undefined;
  };
}

const initState: UIState = {
  filtersMenu: {
    isOpen: true,
    selected: FilterType.OTHER,
  }
};

/* Reducer */

export function uiReducer(state = initState, action: UIActions): UIState {
  switch (action.type) {
    case UIActionType.TOGGLE_FILTERS_MENU: {

      return {
        ...state,
        filtersMenu: {
          ...state.filtersMenu,
          isOpen: !state.filtersMenu.isOpen
        }
      };
    }

    case UIActionType.CLOSE_FILTERS_MENU: {
      return {
        ...state,
        filtersMenu: {
          ...state.filtersMenu,
          isOpen: false
        }
      };
    }

    case UIActionType.OPEN_FILTERS_MENU: {
      return {
        ...state,
        filtersMenu: {
          ...state.filtersMenu,
          isOpen: true
        }
      };
    }

    case UIActionType.SET_SELECTED_FILTER: {
      const selected = (state.filtersMenu.selected !== action.payload) ?
        action.payload :
        undefined;

      return {
        ...state,
        filtersMenu: {
          ...state.filtersMenu,
          selected
        }
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
  (state: UIState) => state.filtersMenu
);

export const getSelectedFilter = createSelector(
  getFiltersMenuState,
  state => state.selected
);

export const getIsFiltersMenuOpen = createSelector(
  getFiltersMenuState,
  state => state.isOpen
);
