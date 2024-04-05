import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserActionType, UserActions } from './user.action';
import * as models from '@models';
import jwt_decode from 'jwt-decode';
/* State */

export interface UserState {
  auth: models.UserAuth;
  profile: models.UserProfile;
  savedSearches: {
    searches: models.Search[];
    searchHistory: models.Search[];
  };
  savedFilterPresets: models.SavedFilterPreset[];
}

export const initState: UserState = {
  auth: {
    id: null,
    token: null,
    groups: []
  },
  profile: {
    defaultDataset: 'NISAR',
    mapLayer: models.MapLayerTypes.SATELLITE,
    maxResults: 250,
    defaultMaxConcurrentDownloads: 3,
    defaultFilterPresets: {
      'Baseline Search' : '',
      'Geographic Search' : '',
      'SBAS Search' : ''
    },
    hyp3BackendUrl: '',
    theme: 'light',
    language: ''
  },
  savedSearches: {
    searches: [],
    searchHistory: []
  },
  savedFilterPresets: []

};

/* Reducer */

export function userReducer(state = initState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionType.LOGIN: {
      return {
        ...state,
        auth: action.payload
      };
    }

    case UserActionType.LOGOUT: {
      return {
        ...state,
        auth: {
          id: null,
          token: null,
          groups: []
        }
      };
    }

    case UserActionType.SET_PROFILE: {
      return {
        ...state,
        profile: action.payload
      };
    }

    case UserActionType.SET_SEARCHES: {
      return {
        ...state,
        savedSearches: {
          ...state.savedSearches,
          searches: action.payload
        }
      };
    }

    case UserActionType.ADD_NEW_SEARCH: {
      const searches = [ action.payload, ...state.savedSearches.searches ];

      return {
        ...state,
        savedSearches: {
          ...state.savedSearches,
          searches
        }
      };
    }

    case UserActionType.SET_SEARCH_HISTORY: {
      return {
        ...state,
        savedSearches: {
          ...state.savedSearches,
          searchHistory: action.payload
        }
      };
    }

    case UserActionType.ADD_SEARCH_TO_HISTORY: {
      const searchHistory = [ action.payload, ...state.savedSearches.searchHistory ]
        .slice(0, 10);

      return {
        ...state,
        savedSearches: {
          ...state.savedSearches,
          searchHistory
        }
      };
    }

    case UserActionType.UPDATE_SEARCH_WITH_FILTERS: {
      const updateFunc = (search, _) => {
        return {
          ...search,
          filters: action.payload.filters
        };
      };

      return updateItem(state, action, updateFunc);
    }

    case UserActionType.UPDATE_SEARCH_NAME: {
      const updateFunc = (search, _) => {
        return {
          ...search,
          name: action.payload.name
        };
      };

      return updateItem(state, action, updateFunc);
    }

    case UserActionType.DELETE_SAVED_SEARCH: {
      const searches = [ ...state.savedSearches.searches ]
        .filter(search => search.id !== action.payload);

      return {
        ...state,
        savedSearches: {
          ...state.savedSearches,
          searches
        }
      };
    }

    case UserActionType.ADD_NEW_FILTERS_PRESET: {
      return {
        ...state,
        savedFilterPresets: [ ...state.savedFilterPresets, action.payload]
      };
    }

    case UserActionType.DELETE_FILTERS_PRESET: {
      return {
        ...state,
        savedFilterPresets: state.savedFilterPresets.filter(preset => preset.id !== action.payload)
      };
    }

    case UserActionType.UPDATE_FILTERS_PRESET_NAME: {
      const newFilterIdx = state.savedFilterPresets.findIndex(preset => preset.id === action.payload.presetID);

      const newFilter = {
        ... state.savedFilterPresets.find(preset => preset.id === action.payload.presetID),
        name: action.payload.newName
      };

      const newFilterPresets = state.savedFilterPresets.filter(preset => preset.id !== action.payload.presetID);
      newFilterPresets.splice(newFilterIdx, 0, newFilter);
      return {
        ...state,
        savedFilterPresets: newFilterPresets
      };
    }

    case UserActionType.SET_FILTERS: {
      return {
        ...state,
        savedFilterPresets: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

function updateItem(state, action, updateFunc) {
  const searches = [ ...state.savedSearches.searches ];
  const updateSearch = searches
    .filter(search => search.id === action.payload.id)[0];

  const searchIdx = searches.indexOf(updateSearch);

  if (!updateSearch) {
    return { ...state };
  }

  searches[searchIdx] = updateFunc(updateSearch);

  return {
    ...state,
    savedSearches: {
      ...state.savedSearches,
      searches
    }
  };
}

/* Selectors */

export const getUserState = createFeatureSelector<UserState>('user');

export const getUserAuth = createSelector(
  getUserState,
  (state: UserState) => state.auth
);

export const getHasRestrictedDataAccess = createSelector(
  getUserState,
  (state: UserState) => {
    const groups = state.auth.groups;
    return (
      groups.length > 0 &&
      groups.some(
        group => group.name === 'HAS_ACCESS_TO_RESTRICTED_DATA'
      )
    );
  }
);


export const getUserProfile = createSelector(
  getUserState,
  (state: UserState) => state.profile
);

export const getIsUserLoggedIn = createSelector(
  getUserState,
  (state: UserState) => !!state.auth.id
);

export const getUserEDLToken = createSelector(
  getUserState,
  (state: UserState) => {
    if (state.auth.token) {
      const decoded = jwt_decode(state.auth.token)
      return decoded['urs-access-token'] ?? null
    }
    return null;
  }
);

export const getSavedSearches = createSelector(
  getUserState,
  (state: UserState) => state.savedSearches.searches
);

export const getSearchHistory = createSelector(
  getUserState,
  (state: UserState) => state.savedSearches.searchHistory
);

export const getSavedFilters = createSelector(
  getUserState,
  (state: UserState) => state.savedFilterPresets
);
