import { Action } from '@ngrx/store';

import { FilterType } from '../../models/';

export enum UIActionType {
  TOGGLE_FILTERS_MENU = '[UI] Toggle Filters Menu',
  CLOSE_FILTERS_MENU = '[UI] Close Filters Menu',
  OPEN_FILTERS_MENU = '[UI] Open Filters Menu',

  SET_SELECTED_FILTER = '[UI] Set Selected Filter'
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

export class SetSelectedFilter implements Action {
  public readonly type = UIActionType.SET_SELECTED_FILTER;

  constructor(public payload: FilterType) {}
}

export type UIActions =
  | ToggleFiltersMenu
  | CloseFiltersMenu
  | OpenFiltersMenu
  | SetSelectedFilter;
