import { Action } from '@ngrx/store';

import { CMRProduct } from '@models';

export enum ScenesActionType {
  SET_GRANULES = '[Granuels] Set Scenes',
  CLEAR = '[Granuels] Clear Scenes',

  SET_FOCUSED_GRANULE = '[Scenes] Set Focused Scene',
  CLEAR_FOCUSED_GRANULE = '[Scenes] Clear Focused Scene',
  SET_RESULTS_LOADED = '[Scenes] Set Results Loaded',

  SET_SELECTED_GRANULE = '[Scenes] Set Selected Scene',
  SELECT_NEXT_GRANULE = '[Scenes] Select Next Scene',
  SELECT_PREVIOUS_GRANULE = '[Scenes] Select Previous Scene',
}

export class SetScenes implements Action {
  public readonly type = ScenesActionType.SET_GRANULES;

  constructor(public payload: CMRProduct[]) {}
}

export class ClearScenes implements Action {
  public readonly type = ScenesActionType.CLEAR;
}

export class SetSelectedScene implements Action {
  public readonly type = ScenesActionType.SET_SELECTED_GRANULE;

  constructor(public payload: string) {}
}

export class SetResultsLoaded implements Action {
  public readonly type = ScenesActionType.SET_RESULTS_LOADED;

  constructor(public payload: boolean) {}
}

export class SelectNextScene implements Action {
  public readonly type = ScenesActionType.SELECT_NEXT_GRANULE;
}

export class SelectPreviousScene implements Action {
  public readonly type = ScenesActionType.SELECT_PREVIOUS_GRANULE;
}


export class SetFocusedScene implements Action {
  public readonly type = ScenesActionType.SET_FOCUSED_GRANULE;

  constructor(public payload: CMRProduct) {}
}

export class ClearFocusedScene implements Action {
  public readonly type = ScenesActionType.CLEAR_FOCUSED_GRANULE;
}

export type ScenesActions =
  | SetScenes
  | ClearScenes
  | SetSelectedScene
  | SelectNextScene
  | SelectPreviousScene
  | SetFocusedScene
  | ClearFocusedScene
  | SetResultsLoaded;
