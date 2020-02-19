import { Action } from '@ngrx/store';

import { CMRProduct, UnzippedFolder } from '@models';

export enum ScenesActionType {
  SET_SCENES = '[Granuels] Set Scenes',
  CLEAR = '[Granuels] Clear Scenes',

  SET_RESULTS_LOADED = '[Scenes] Set Results Loaded',
  LOAD_UNZIPPED_PRODUCT = '[Scenes] Load unzipped product',
  ADD_UNZIPPED_PRODUCT = '[Scenes] Add unzipped product',

  SET_SELECTED_SCENE = '[Scenes] Set Selected Scene',
  SELECT_NEXT_SCENE = '[Scenes] Select Next Scene',
  SELECT_PREVIOUS_SCENE = '[Scenes] Select Previous Scene',

  SELECT_NEXT_WITH_BROWSE = '[Scenes] Set next with browse',
  SELECT_PREVIOUS_WITH_BROWSE = '[Scenes] Set previous with browse'
}

export class SetScenes implements Action {
  public readonly type = ScenesActionType.SET_SCENES;

  constructor(public payload: CMRProduct[]) {}
}

export class ClearScenes implements Action {
  public readonly type = ScenesActionType.CLEAR;
}

export class SetSelectedScene implements Action {
  public readonly type = ScenesActionType.SET_SELECTED_SCENE;

  constructor(public payload: string) {}
}

export class SetResultsLoaded implements Action {
  public readonly type = ScenesActionType.SET_RESULTS_LOADED;

  constructor(public payload: boolean) {}
}

export class SelectNextScene implements Action {
  public readonly type = ScenesActionType.SELECT_NEXT_SCENE;
}

export class SelectPreviousScene implements Action {
  public readonly type = ScenesActionType.SELECT_PREVIOUS_SCENE;
}

export class SelectPreviousWithBrowse implements Action {
  public readonly type = ScenesActionType.SELECT_PREVIOUS_WITH_BROWSE;
}

export class SelectNextWithBrowse implements Action {
  public readonly type = ScenesActionType.SELECT_NEXT_WITH_BROWSE;
}

export class AddUnzippedProduct implements Action {
  public readonly type = ScenesActionType.ADD_UNZIPPED_PRODUCT;

  constructor(public payload: { product: CMRProduct, unzipped: UnzippedFolder }) {}
}

export class LoadUnzippedProduct implements Action {
  public readonly type = ScenesActionType.LOAD_UNZIPPED_PRODUCT;

  constructor(public payload: CMRProduct) {}
}


export type ScenesActions =
  | SetScenes
  | ClearScenes
  | AddUnzippedProduct
  | LoadUnzippedProduct
  | SetSelectedScene
  | SelectNextScene
  | SelectPreviousScene
  | SelectNextWithBrowse
  | SelectPreviousWithBrowse
  | SetResultsLoaded;
