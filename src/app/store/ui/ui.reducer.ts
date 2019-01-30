import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FilterType } from '@models';

import { UIActionType, UIActions } from './ui.action';


export interface UIState {
  isSidebarOpen: boolean;
  selectedFilter: FilterType | undefined;
}

const initState: UIState = {
  isSidebarOpen: true,
  selectedFilter: FilterType.PLATFORM
};


export function uiReducer(state = initState, action: UIActions): UIState {
  switch (action.type) {
    case UIActionType.TOGGLE_SIDEBAR: {

      return {
          ...state,
          isSidebarOpen: !state.isSidebarOpen
        };
    }

    case UIActionType.CLOSE_SIDEBAR: {
      return {
        ...state,
          isSidebarOpen: false
        };
    }

    case UIActionType.OPEN_SIDEBAR: {
      return {
        ...state,
          isSidebarOpen: true
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


export const getUIState = createFeatureSelector<UIState>('ui');

export const getFiltersMenuState = createSelector(
  getUIState,
  (state: UIState) => state
);

export const getSelectedFilter = createSelector(
  getFiltersMenuState,
  state => state.selectedFilter
);

export const getIsSidebarOpen = createSelector(
  getFiltersMenuState,
  state => state.isSidebarOpen
);
