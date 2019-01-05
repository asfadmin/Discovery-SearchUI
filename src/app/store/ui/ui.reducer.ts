import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UIActionType, UIActions } from './ui.action';

/* State */

export interface UIState {
  filtersMenu: {
    isOpen: boolean
  };
}

const initState: UIState = {
  filtersMenu: {
    isOpen: true
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
