import { Action } from '@ngrx/store';

import { UserAuth, UserProfile, Search, GeographicFiltersType, ListFiltersType } from '@models';

export enum UserActionType {
  SET_USER_AUTH = '[User] Set User Auth',

  SAVE_PROFILE = '[User] Save User Profile',
  SET_PROFILE = '[User] Set User Profile',

  SAVE_SEARCHES = '[User] Save Searches',
  ADD_NEW_SEARCH = '[User] Add new search',
  UPDATE_SEARCH_WITH_FILTERS = '[User] Update search with current filters',
  UPDATE_SEARCH_NAME = '[User] Edit Search Name',
  DELETE_SAVED_SEARCH = '[User] Delete Saved Search',
  LOAD_SAVED_SEARCHES = '[User] Load Saved Searches',
}

export class SetUserAuth implements Action {
  public readonly type = UserActionType.SET_USER_AUTH;

  constructor(public payload: UserAuth) {}
}

export class SaveProfile implements Action {
  public readonly type = UserActionType.SAVE_PROFILE;
}

export class SetProfile implements Action {
  public readonly type = UserActionType.SET_PROFILE;

  constructor(public payload: UserProfile) {}
}

export class SaveSearches implements Action {
  public readonly type = UserActionType.SAVE_SEARCHES;
}

export class AddNewSearch implements Action {
  public readonly type = UserActionType.ADD_NEW_SEARCH;

  constructor(public payload: Search) {}
}

export class UpdateSearchWithFilters implements Action {
  public readonly type = UserActionType.UPDATE_SEARCH_WITH_FILTERS;

  constructor(public payload: {
    id: string,
    filters: GeographicFiltersType
  }) {}
}

export class UpdateSearchName implements Action {
  public readonly type = UserActionType.UPDATE_SEARCH_NAME;

  constructor(public payload: {
    id: string;
    name: string;
  }) {}
}

export class DeleteSavedSearch implements Action {
  public readonly type = UserActionType.DELETE_SAVED_SEARCH;

  constructor(public payload: string) {}
}

export class LoadSavedSearches implements Action {
  public readonly type = UserActionType.LOAD_SAVED_SEARCHES;
}


export type UserActions =
  | SaveProfile
  | SetProfile
  | SaveSearches
  | AddNewSearch
  | UpdateSearchName
  | UpdateSearchWithFilters
  | DeleteSavedSearch
  | LoadSavedSearches
  | SetUserAuth;
