import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserActionType, UserActions } from './user.action';
import * as models from '@models';

/* State */

export interface UserState {
  auth: models.UserAuth;
  profile: models.UserProfile;
}

const initState: UserState = {
  auth: {
    id: null,
    token: null
  },
  profile: {
    defaultDataset: 'Sentinel-1',
    view: models.MapLayerTypes.SATELLITE,
    maxResults: 250
  }
};

/* Reducer */

export function userReducer(state = initState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionType.SET_USER_AUTH: {
      return {
        ...state,
        auth: action.payload
      };
    }

    case UserActionType.SET_PROFILE: {
      return {
        ...state,
        profile: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

/* Selectors */

export const getUserState = createFeatureSelector<UserState>('user');

export const getUserAuth = createSelector(
  getUserState,
  (state: UserState) => state.auth
);

export const getUserProfile = createSelector(
  getUserState,
  (state: UserState) => state.profile
);

export const getIsUserLoggedIn = createSelector(
  getUserState,
  (state: UserState) => !!state.auth.id
);
