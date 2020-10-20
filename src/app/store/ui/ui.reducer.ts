import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Banner, SavedSearchType } from '@models';

import { UIActionType, UIActions } from './ui.action';


export interface UIState {
  isFiltersMenuOpen: boolean;
  isResultsMenuOpen: boolean;
  isSidebarOpen: boolean;
  isSaveSearchOn: boolean;
  isAOIOptionsOpen: boolean;
  showS1RawData: boolean;
  showExpiredData: boolean;
  isBrowseDialogOpen: boolean;
  onlyScenesWithBrowse: boolean;
  isAddingCustomPoint: boolean;
  savedSearchType: SavedSearchType;
  banners: Banner[];
}

export const initState: UIState = {
  isFiltersMenuOpen: false,
  isResultsMenuOpen: false,
  isSidebarOpen: false,
  isSaveSearchOn: false,
  isAOIOptionsOpen: false,
  showS1RawData: false,
  showExpiredData: true,
  isBrowseDialogOpen: false,
  onlyScenesWithBrowse: true,
  isAddingCustomPoint: false,
  savedSearchType: SavedSearchType.SAVED,
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

    case UIActionType.OPEN_SIDEBAR: {
      return {
        ...state,
        isSidebarOpen: true
      };
    }

    case UIActionType.CLOSE_SIDEBAR: {
      return {
        ...state,
        isSidebarOpen: false
      };
    }

    case UIActionType.SHOW_S1_RAW_DATA: {
      return {
        ...state,
        showS1RawData: true
      };
    }

    case UIActionType.HIDE_EXPIRED_DATA: {
      return {
        ...state,
        showExpiredData: false
      };
    }

    case UIActionType.SHOW_EXPIRED_DATA: {
      return {
        ...state,
        showExpiredData: true
      };
    }

    case UIActionType.HIDE_S1_RAW_DATA: {
      return {
        ...state,
        showS1RawData: false
      };
    }

    case UIActionType.START_ADDING_CUSTOM_POINT: {
      return {
        ...state,
        isAddingCustomPoint: true
      };
    }

    case UIActionType.STOP_ADDING_CUSTOM_POINT: {
      return {
        ...state,
        isAddingCustomPoint: false
      };
    }

    case UIActionType.SET_SAVE_SEARCH_ON: {
      return {
        ...state,
        isSaveSearchOn: action.payload,
      };
    }

    case UIActionType.SET_SAVED_SEARCH_TYPE: {
      return {
        ...state,
        savedSearchType: action.payload
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
        isResultsMenuOpen: !state.isResultsMenuOpen
      };
    }

    case UIActionType.CLOSE_BOTTOM_MENU: {
      return {
        ...state,
        isResultsMenuOpen: false
      };
    }

    case UIActionType.OPEN_BOTTOM_MENU: {
      return {
        ...state,
        isResultsMenuOpen: true
      };
    }

    case UIActionType.SET_ONLY_SCENES_WITH_BROWSE: {
      return {
        ...state,
        onlyScenesWithBrowse: action.payload
      };
    }

    case UIActionType.SET_IS_BROWSE_DIALOG_OPEN: {
      return {
        ...state,
        isBrowseDialogOpen: action.payload
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

export const getIsAOIOptionsOpen = createSelector(
  getUIState,
  (state: UIState) => state.isAOIOptionsOpen
);

export const getIsFiltersMenuOpen = createSelector(
  getUIState,
  (state: UIState) => state.isFiltersMenuOpen
);

export const getIsResultsMenuOpen = createSelector(
  getUIState,
  state => state.isResultsMenuOpen
);

export const getIsBrowseDialogOpen = createSelector(
  getUIState,
  state => state.isBrowseDialogOpen
);

export const getOnlyScenesWithBrowse = createSelector(
  getUIState,
  state => state.onlyScenesWithBrowse
);

export const getBanners = createSelector(
  getUIState,
  state => state.banners
);

export const getIsSidebarOpen = createSelector(
  getUIState,
  state => state.isSidebarOpen
);

export const getIsSaveSearchOn = createSelector(
  getUIState,
  state => state.isSaveSearchOn
);

export const getSaveSearchType = createSelector(
  getUIState,
  state => state.savedSearchType
);

export const getIsAddingCustomPoint = createSelector(
  getUIState,
  state => state.isAddingCustomPoint
);

export const getShowS1RawData = createSelector(
  getUIState,
  state => state.showS1RawData
);

export const getShowExpiredData = createSelector(
  getUIState,
  state => state.showExpiredData
);
