import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserActionType, UserActions } from './user.action';
import * as models from '@models';

/* State */

export interface UserState {
  auth: models.UserAuth;
}

const initState: UserState = {
  auth: {
    id: null,
    token: null
  }
};

/* Reducer */

export function userReducer(state = initState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionType.SET_USER_AUTH: {
      return state;
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

export const getIsUserLoggedIn = createSelector(
  getUserState,
  (state: UserState) => !!state.auth.id
);
