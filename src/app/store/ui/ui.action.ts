import { Action } from '@ngrx/store';

import { Banner, SavedSearchType } from '@models';

export enum UIActionType {
  TOGGLE_AOI_OPTIONS = '[UI] Toggle AOI Options',
  CLOSE_AOI_OPTIONS = '[UI] Close AOI Options',

  TOGGLE_FILTERS_MENU = '[UI] Toggle Filters Menu',
  CLOSE_FILTERS_MENU = '[UI] Close Filters Menu',
  OPEN_FILTERS_MENU = '[UI] Open Filters Menu ',

  CLOSE_SIDEBAR = '[UI] Close Sidebar',
  OPEN_SIDEBAR = '[UI] Open Sidebar',

  SET_SAVE_SEARCH_ON = '[UI] Set Save Search On',
  SET_SAVED_SEARCH_TYPE = '[UI] Set Saved Search Type',

  START_ADDING_CUSTOM_POINT = '[UI] Start Adding Custom Point',
  STOP_ADDING_CUSTOM_POINT = '[UI] Stop Adding Custom Point',

  SET_IS_BROWSE_DIALOG_OPEN = '[UI] Set Is Browse Dialog Open',
  SET_ONLY_SCENES_WITH_BROWSE = '[UI] Set Only Scenes With Browse',

  TOGGLE_BOTTOM_MENU = '[UI] Toggle Bottom Menu',
  CLOSE_BOTTOM_MENU = '[UI] Close Bottom Menu',
  OPEN_BOTTOM_MENU = '[UI] Open Bottom Menu ',

  LOAD_BANNERS = '[Banner] Load Banners',
  ADD_BANNERS = '[Banner] Set Banners',
  REMOVE_BANNER = '[Banner] Remove Banner',
}

export class ToggleAOIOptions implements Action {
  public readonly type = UIActionType.TOGGLE_AOI_OPTIONS;
}

export class CloseAOIOptions implements Action {
  public readonly type = UIActionType.CLOSE_AOI_OPTIONS;
}

export class ToggleFiltersMenu implements Action {
  public readonly type = UIActionType.TOGGLE_FILTERS_MENU;
}

export class CloseSidebar implements Action {
  public readonly type = UIActionType.CLOSE_SIDEBAR;
}

export class OpenSidebar implements Action {
  public readonly type = UIActionType.OPEN_SIDEBAR;
}

export class StartAddingCustomPoint implements Action {
  public readonly type = UIActionType.START_ADDING_CUSTOM_POINT;
}

export class StopAddingCustomPoint implements Action {
  public readonly type = UIActionType.STOP_ADDING_CUSTOM_POINT;
}

export class SetSaveSearchOn implements Action {
  public readonly type = UIActionType.SET_SAVE_SEARCH_ON;

  constructor(public payload: boolean) {}
}

export class SetSavedSearchType implements Action {
  public readonly type = UIActionType.SET_SAVED_SEARCH_TYPE;

  constructor(public payload: SavedSearchType) {}
}

export class CloseFiltersMenu implements Action {
  public readonly type = UIActionType.CLOSE_FILTERS_MENU;
}

export class OpenFiltersMenu implements Action {
  public readonly type = UIActionType.OPEN_FILTERS_MENU;
}

export class ToggleResultsMenu implements Action {
  public readonly type = UIActionType.TOGGLE_BOTTOM_MENU;
}

export class CloseResultsMenu implements Action {
  public readonly type = UIActionType.CLOSE_BOTTOM_MENU;
}

export class OpenResultsMenu implements Action {
  public readonly type = UIActionType.OPEN_BOTTOM_MENU;
}

export class SetIsBrowseDialogOpen implements Action {
  public readonly type = UIActionType.SET_IS_BROWSE_DIALOG_OPEN;

  constructor(public payload: boolean) {}
}

export class SetOnlyScenesWithBrowse implements Action {
  public readonly type = UIActionType.SET_ONLY_SCENES_WITH_BROWSE;

  constructor(public payload: boolean) {}
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
  | ToggleAOIOptions
  | CloseAOIOptions
  | OpenSidebar
  | SetSaveSearchOn
  | StartAddingCustomPoint
  | StopAddingCustomPoint
  | SetSavedSearchType
  | CloseSidebar
  | ToggleFiltersMenu
  | CloseFiltersMenu
  | OpenFiltersMenu
  | ToggleResultsMenu
  | CloseResultsMenu
  | OpenResultsMenu
  | SetOnlyScenesWithBrowse
  | SetIsBrowseDialogOpen
  | LoadBanners
  | RemoveBanner
  | AddBanners;

