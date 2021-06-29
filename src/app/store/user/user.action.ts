import { Action } from '@ngrx/store';

import { UserAuth, UserProfile, Search, GeographicFiltersType, FilterType, SearchType } from '@models';

export enum UserActionType {
  LOGIN = '[User] Login',
  LOGOUT = '[User] Logout',

  LOAD_PROFILE = '[User] Load User Profile',
  SAVE_PROFILE = '[User] Save User Profile',
  SET_PROFILE = '[User] Set User Profile',

  LOAD_SAVED_SEARCHES = '[User] Load Saved Searches',
  SAVE_SEARCHES = '[User] Save Searches',
  SET_SEARCHES = '[User] Set searches',

  ADD_SEARCH_TO_HISTORY = '[User] Add Search to History',
  SET_SEARCH_HISTORY = '[User] Set Search History',
  SAVE_SEARCH_HISTORY = '[User] Save Search History',
  LOAD_SEARCH_HISTORY = '[User] Load Search History',

  LOAD_SAVED_FILTERS = '[User] Load Saved Filters',
  SAVE_FILTERS = '[User] Save Filter Presets',
  SET_FILTERS = '[User] Set Filter Presets',

  ADD_NEW_SEARCH = '[User] Add new search',
  UPDATE_SEARCH_WITH_FILTERS = '[User] Update search with current filters',
  UPDATE_SEARCH_NAME = '[User] Edit Search Name',
  DELETE_SAVED_SEARCH = '[User] Delete Saved Search',

  ADD_NEW_FILTERS_PRESET = '[User] Save Search Filters',
  DELETE_FILTERS_PRESET = '[User] Delete Saved Filters Preset',
  LOAD_FILTERS_PRESET = '[User] Load Saved Filters Preset',

  UPDATE_FILTERS_PRESET_NAME = '[User] Change Filter Preset Name'
}

export class Login implements Action {
  public readonly type = UserActionType.LOGIN;

  constructor(public payload: UserAuth) {}
}

export class Logout implements Action {
  public readonly type = UserActionType.LOGOUT;
}

export class AddSearchToHistory implements Action {
  public readonly type = UserActionType.ADD_SEARCH_TO_HISTORY;

  constructor(public payload: Search) {}
}

export class SetSearchHistory implements Action {
  public readonly type = UserActionType.SET_SEARCH_HISTORY;

  constructor(public payload: Search[]) {}
}

export class SaveSearchHistory implements Action {
  public readonly type = UserActionType.SAVE_SEARCH_HISTORY;
}

export class LoadSearchHistory implements Action {
  public readonly type = UserActionType.LOAD_SEARCH_HISTORY;
}

export class LoadProfile implements Action {
  public readonly type = UserActionType.LOAD_PROFILE;
}

export class SaveProfile implements Action {
  public readonly type = UserActionType.SAVE_PROFILE;
}

export class SetProfile implements Action {
  public readonly type = UserActionType.SET_PROFILE;

  constructor(public payload: UserProfile) {}
}

export class LoadSavedSearches implements Action {
  public readonly type = UserActionType.LOAD_SAVED_SEARCHES;
}

export class SaveSearches implements Action {
  public readonly type = UserActionType.SAVE_SEARCHES;
}

export class SetSearches implements Action {
  public readonly type = UserActionType.SET_SEARCHES;

  constructor(public payload: Search[]) {}
}

export class LoadSavedFilters implements Action {
  public readonly type = UserActionType.LOAD_SAVED_FILTERS;

  constructor(public payload: {name: string, id: string, searchType: SearchType, filters: FilterType}[]) {}
}

export class SaveFilters implements Action {
  public readonly type = UserActionType.SAVE_FILTERS;
}


export class SetFilters implements Action {
  public readonly type = UserActionType.SET_FILTERS;

  constructor(public payload: {name: string, id: string, searchType: SearchType, filters: FilterType}[]) {}
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

export class AddNewFiltersPreset implements Action {
  public readonly type = UserActionType.ADD_NEW_FILTERS_PRESET;

  constructor(public payload: {name: string, id: string, searchType: SearchType, filters: FilterType}) {}
}

export class DeleteFiltersPreset implements Action {
  public readonly type = UserActionType.DELETE_FILTERS_PRESET;

  constructor(public payload: string) {}
}

export class LoadFiltersPreset implements Action {
  public readonly type = UserActionType.LOAD_FILTERS_PRESET;

  constructor(public payload: string) {}
}

export class UpdateFilterPresetName implements Action {
  public readonly type = UserActionType.UPDATE_FILTERS_PRESET_NAME;

  constructor(public payload: {presetID: string, newName: string}) {}
}

export type UserActions =
  | SaveProfile
  | SetProfile
  | LoadProfile
  | SetSearches
  | SaveSearches
  | AddNewSearch
  | UpdateSearchName
  | UpdateSearchWithFilters
  | DeleteSavedSearch
  | LoadSavedSearches
  | SaveSearchHistory
  | LoadSearchHistory
  | SetSearchHistory
  | AddSearchToHistory
  | LoadSavedFilters
  | SaveFilters
  | AddNewFiltersPreset
  | DeleteFiltersPreset
  | LoadFiltersPreset
  | SetFilters
  | UpdateFilterPresetName
  | Logout
  | Login;
