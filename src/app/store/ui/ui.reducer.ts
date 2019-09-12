import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FilterType, SearchType, ViewType, Banner } from '@models';

import { UIActionType, UIActions } from './ui.action';


export interface UIState {
  isFiltersMenuOpen: boolean;
  isBottomMenuOpen: boolean;
  isAOIOptionsOpen: boolean;
  uiView: ViewType;
  selectedFilter: FilterType | undefined;
  searchType: SearchType | null;
  banners: Banner[];
}

export const initState: UIState = {
  isFiltersMenuOpen: false,
  isBottomMenuOpen: false,
  isAOIOptionsOpen: false,
  uiView: ViewType.MAIN,
  selectedFilter: FilterType.DATASET,
  searchType: SearchType.DATASET,
  banners: [],
};


export function uiReducer(state = initState, action: UIActions): UIState {
  switch (action.type) {
    case UIActionType.TOGGLE_AOI_OPTIONS: {
      return {
          ...state,
          isAOIOptionsOpen: !state.isAOIOptionsOpen,
        };
    }

    case UIActionType.CLOSE_AOI_OPTIONS: {
      return {
          ...state,
          isAOIOptionsOpen: false
        };
    }

    case UIActionType.TOGGLE_FILTERS_MENU: {
      return {
          ...state,
          isFiltersMenuOpen: !state.isFiltersMenuOpen,
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

    case UIActionType.TOGGLE_BOTTOM_MENU: {
      return {
          ...state,
          isBottomMenuOpen: !state.isBottomMenuOpen
        };
    }

    case UIActionType.CLOSE_BOTTOM_MENU: {
      return {
          ...state,
          isBottomMenuOpen: false
        };
    }

    case UIActionType.OPEN_BOTTOM_MENU: {
      return {
          ...state,
          isBottomMenuOpen: true
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
          searchType: action.payload,
        };
    }

    case UIActionType.SET_UI_VIEW: {
      return {
          ...state,
          uiView: action.payload
        };
    }

    case UIActionType.ADD_BANNERS: {
      const banners = [
        ...state.banners, ...action.payload
      ];

      return {
        ...state,
        banners
      };
    }

    case UIActionType.REMOVE_BANNER: {
      const banners = [ ...state.banners ]
        .filter(banner => banner !== action.payload);

      return {
        ...state,
        banners
      };
    }

    default: {
      return state;
    }
  }
}


export const getUIState = createFeatureSelector<UIState>('ui');

export const getSelectedFilter = createSelector(
  getUIState,
  state => state.selectedFilter
);

export const getSearchType = createSelector(
  getUIState,
  state => state.searchType
);

export const getIsAOIOptionsOpen = createSelector(
  getUIState,
  (state: UIState) => state.isAOIOptionsOpen
);

export const getIsFiltersMenuOpen = createSelector(
  getUIState,
  (state: UIState) => state.isFiltersMenuOpen
);

export const getUiView = createSelector(
  getUIState,
  state => state.uiView
);

export const getIsHidden = createSelector(
  getUIState,
  state => state.uiView === ViewType.MAP_ONLY
);

export const getIsBottomMenuOpen = createSelector(
  getUIState,
  state => state.isBottomMenuOpen
);

export const getBanners = createSelector(
  getUIState,
  state => state.banners
);
