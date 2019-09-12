import { Action } from '@ngrx/store';

import { FilterType, SearchType, ViewType, Banner } from '@models';

export enum UIActionType {
  TOGGLE_FILTERS_MENU = '[UI] Toggle Filters Menu',
  CLOSE_FILTERS_MENU = '[UI] Close Filters Menu',
  OPEN_FILTERS_MENU = '[UI] Open Filters Menu ',

  TOGGLE_BOTTOM_MENU = '[UI] Toggle Bottom Menu',
  CLOSE_BOTTOM_MENU = '[UI] Close Bottom Menu',
  OPEN_BOTTOM_MENU = '[UI] Open Bottom Menu ',

  SET_SELECTED_FILTER = '[UI] Set Selected Filter',
  SET_SEARCH_TYPE = '[UI] Set Search Type',
  SET_UI_VIEW = '[UI] Set UI View',

  LOAD_BANNERS = '[Banner] Load Banners',
  ADD_BANNERS = '[Banner] Set Banners',
  REMOVE_BANNER = '[Banner] Remove Banner',
}

export class ToggleFiltersMenu implements Action {
  public readonly type = UIActionType.TOGGLE_FILTERS_MENU;
}

export class CloseFiltersMenu implements Action {
  public readonly type = UIActionType.CLOSE_FILTERS_MENU;
}

export class OpenFiltersMenu implements Action {
  public readonly type = UIActionType.OPEN_FILTERS_MENU;
}

export class ToggleBottomMenu implements Action {
  public readonly type = UIActionType.TOGGLE_BOTTOM_MENU;
}

export class CloseBottomMenu implements Action {
  public readonly type = UIActionType.CLOSE_BOTTOM_MENU;
}

export class OpenBottomMenu implements Action {
  public readonly type = UIActionType.OPEN_BOTTOM_MENU;
}

export class SetSelectedFilter implements Action {
  public readonly type = UIActionType.SET_SELECTED_FILTER;

  constructor(public payload: FilterType) {}
}

export class SetSearchType implements Action {
  public readonly type = UIActionType.SET_SEARCH_TYPE;

  constructor(public payload: SearchType) {}
}

export class SetUiView implements Action {
  public readonly type = UIActionType.SET_UI_VIEW;

  constructor(public payload: ViewType) {}
}

export class RemoveBanner implements Action {
  public readonly type = UIActionType.REMOVE_BANNER;

  constructor(public payload: Banner) {}
}

export class AddBanners implements Action {
  public readonly type = UIActionType.ADD_BANNERS;

  constructor(public payload: Banner[]) {}
}

export class LoadBanners implements Action {
  public readonly type = UIActionType.LOAD_BANNERS;
}

export type UIActions =
  | ToggleFiltersMenu
  | CloseFiltersMenu
  | OpenFiltersMenu
  | ToggleBottomMenu
  | CloseBottomMenu
  | OpenBottomMenu
  | SetSelectedFilter
  | SetSearchType
  | SetUiView
  | LoadBanners
  | RemoveBanner
  | AddBanners;

