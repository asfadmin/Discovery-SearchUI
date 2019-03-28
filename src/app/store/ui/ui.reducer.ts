import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FilterType, SearchType, ViewType } from '@models';

import { UIActionType, UIActions } from './ui.action';


export interface UIState {
  isSidebarOpen: boolean;
  uiView: ViewType;
  selectedFilter: FilterType | undefined;
  searchType: SearchType | null;
}

export const initState: UIState = {
  isSidebarOpen: true,
  uiView: ViewType.MAIN,
  selectedFilter: FilterType.PLATFORM,
  searchType: null,
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

    case UIActionType.SET_SEARCH_TYPE: {
      return {
          ...state,
          searchType: action.payload
        };
    }

    case UIActionType.SET_UI_VIEW: {
      return {
          ...state,
          uiView: action.payload
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

export const getSearchType = createSelector(
  getFiltersMenuState,
  state => state.searchType
);

export const getIsSidebarOpen = createSelector(
  getFiltersMenuState,
  state => state.isSidebarOpen
);

export const getUiView = createSelector(
  getUIState,
  state => state.uiView
);

export const getIsHidden = createSelector(
  getUIState,
  state => state.uiView === ViewType.MAP_ONLY
);
