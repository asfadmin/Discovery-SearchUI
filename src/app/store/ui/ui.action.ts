import { Action } from '@ngrx/store';

import { Banner, SidebarType } from '@models';

export enum UIActionType {
  TOGGLE_AOI_OPTIONS = '[UI] Toggle AOI Options',
  CLOSE_AOI_OPTIONS = '[UI] Close AOI Options',
  OPEN_AOI_OPTIONS = '[UI] Open AOI Options',

  TOGGLE_FILTERS_MENU = '[UI] Toggle Filters Menu',
  CLOSE_FILTERS_MENU = '[UI] Close Filters Menu',
  OPEN_FILTERS_MENU = '[UI] Open Filters Menu ',

  SHOW_S1_RAW_DATA = '[UI] Show S1 RAW Data',
  HIDE_S1_RAW_DATA = '[UI] Hide S1 RAW Data',

  SHOW_EXPIRED_DATA = '[UI] Show Expired Data',
  HIDE_EXPIRED_DATA = '[UI] Hide Expired Data',

  OPEN_SIDEBAR = '[UI] Open Sidebar',
  CLOSE_SIDEBAR = '[UI] Close Sidebar',

  START_ADDING_CUSTOM_POINT = '[UI] Start Adding Custom Point',
  STOP_ADDING_CUSTOM_POINT = '[UI] Stop Adding Custom Point',

  SET_IS_BROWSE_DIALOG_OPEN = '[UI] Set Is Browse Dialog Open',
  SET_ONLY_SCENES_WITH_BROWSE = '[UI] Set Only Scenes With Browse',
  SET_HELP_DIALOG_TOPIC = '[UI] Set Help Dialog Topic',
  SET_CURRENT_LANGUAGE = '[UI] Set Current Language',
  SET_IS_DOWNLOAD_QUEUE_OPEN = '[UI] Is Download Queue Open',
  SET_IS_ON_DEMAND_QUEUE_OPEN = '[UI] Is On Demand Queue Open',

  TOGGLE_BOTTOM_MENU = '[UI] Toggle Bottom Menu',
  CLOSE_BOTTOM_MENU = '[UI] Close Bottom Menu',
  OPEN_BOTTOM_MENU = '[UI] Open Bottom Menu ',

  OPEN_PREFERENCE_MENU = '[UI] Open Preferences Menu',
  CLOSE_PREFERENCE_MENU = '[UI] Close Preferences Menu',

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

export class OpenAOIOptions implements Action {
  public readonly type = UIActionType.OPEN_AOI_OPTIONS;
}

export class ToggleFiltersMenu implements Action {
  public readonly type = UIActionType.TOGGLE_FILTERS_MENU;
}

export class OpenSidebar implements Action {
  public readonly type = UIActionType.OPEN_SIDEBAR;

  constructor(public payload: SidebarType) {}
}

export class CloseSidebar implements Action {
  public readonly type = UIActionType.CLOSE_SIDEBAR;
}

export class ShowS1RawData implements Action {
  public readonly type = UIActionType.SHOW_S1_RAW_DATA;
}

export class HideS1RawData implements Action {
  public readonly type = UIActionType.HIDE_S1_RAW_DATA;
}

export class ShowExpiredData implements Action {
  public readonly type = UIActionType.SHOW_EXPIRED_DATA;
}

export class HideExpiredData implements Action {
  public readonly type = UIActionType.HIDE_EXPIRED_DATA;
}

export class StartAddingCustomPoint implements Action {
  public readonly type = UIActionType.START_ADDING_CUSTOM_POINT;
}

export class StopAddingCustomPoint implements Action {
  public readonly type = UIActionType.STOP_ADDING_CUSTOM_POINT;
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

export class OpenPreferenceMenu implements Action {
  public readonly type = UIActionType.OPEN_PREFERENCE_MENU;
}

export class ClosePreferenceMenu implements Action {
  public readonly type = UIActionType.CLOSE_PREFERENCE_MENU;
}

export class SetIsBrowseDialogOpen implements Action {
  public readonly type = UIActionType.SET_IS_BROWSE_DIALOG_OPEN;

  constructor(public payload: boolean) {}
}

export class SetIsDownloadQueueOpen implements Action {
  public readonly type = UIActionType.SET_IS_DOWNLOAD_QUEUE_OPEN ;

  constructor(public payload: boolean) {}
}

export class SetIsOnDemandQueueOpen implements Action {
  public readonly type = UIActionType.SET_IS_ON_DEMAND_QUEUE_OPEN ;

  constructor(public payload: boolean) {}
}

export class SetOnlyScenesWithBrowse implements Action {
  public readonly type = UIActionType.SET_ONLY_SCENES_WITH_BROWSE;

  constructor(public payload: boolean) {}
}

export class SetHelpDialogTopic implements Action {
  public readonly type = UIActionType.SET_HELP_DIALOG_TOPIC;

  constructor(public payload: string | null) {}
}

export class SetCurrentLanguage implements Action {
  public readonly type = UIActionType.SET_CURRENT_LANGUAGE;

  constructor(public payload: string | null) {}
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
  | OpenAOIOptions
  | OpenSidebar
  | CloseSidebar
  | StartAddingCustomPoint
  | StopAddingCustomPoint
  | ToggleFiltersMenu
  | CloseFiltersMenu
  | OpenFiltersMenu
  | ShowS1RawData
  | HideS1RawData
  | ShowExpiredData
  | HideExpiredData
  | ToggleResultsMenu
  | CloseResultsMenu
  | OpenResultsMenu
  | OpenPreferenceMenu
  | ClosePreferenceMenu
  | SetOnlyScenesWithBrowse
  | SetHelpDialogTopic
  | SetCurrentLanguage
  | SetIsBrowseDialogOpen
  | SetIsDownloadQueueOpen
  | SetIsOnDemandQueueOpen
  | LoadBanners
  | RemoveBanner
  | AddBanners;

