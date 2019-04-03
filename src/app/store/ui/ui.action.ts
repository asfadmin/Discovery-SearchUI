import { Action } from '@ngrx/store';

import { FilterType, SearchType, ViewType } from '@models';

export enum UIActionType {
  TOGGLE_SIDEBAR = '[UI] Toggle Sidebar',
  CLOSE_SIDEBAR = '[UI] Close Sidebar',
  OPEN_SIDEBAR = '[UI] Open Sidebar ',

  TOGGLE_BOTTOM_MENU = '[UI] Toggle Bottom Menu',
  CLOSE_BOTTOM_MENU = '[UI] Close Bottom Menu',
  OPEN_BOTTOM_MENU = '[UI] Open Bottom Menu ',

  SET_SELECTED_FILTER = '[UI] Set Selected Filter',
  SET_SEARCH_TYPE = '[UI] Set Search Type',
  SET_UI_VIEW = '[UI] Set UI View'
}

export class ToggleSidebar implements Action {
  public readonly type = UIActionType.TOGGLE_SIDEBAR;
}

export class CloseSidebar implements Action {
  public readonly type = UIActionType.CLOSE_SIDEBAR;
}

export class OpenSidebar implements Action {
  public readonly type = UIActionType.OPEN_SIDEBAR;
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

export type UIActions =
  | ToggleSidebar
  | CloseSidebar
  | OpenSidebar
  | ToggleBottomMenu
  | CloseBottomMenu
  | OpenBottomMenu
  | SetSelectedFilter
  | SetSearchType
  | SetUiView;

