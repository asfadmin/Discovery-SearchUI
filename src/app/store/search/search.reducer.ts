import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SearchActionType, SearchActions } from './search.action';


export interface SearchState {
  isLoading: boolean;
}

const initState: SearchState = {
  isLoading: false,
};

export function searchReducer(state = initState, action: SearchActions): SearchState {
  switch (action.type) {
    case SearchActionType.MAKE_SEARCH: {
      return {
        ...state,
        isLoading: true
      };
    }

    case SearchActionType.SEARCH_RESPONSE: {
      return {
        ...state,
        isLoading: false
      };
    }

    default: {
      return state;
    }
  }
}

export const getSearchState = createFeatureSelector<SearchState>('search');

export const getIsLoading = createSelector(
  getSearchState,
  (state: SearchState) => state.isLoading
);
