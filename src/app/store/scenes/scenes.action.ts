import { Action } from '@ngrx/store';

import { CMRProduct, UnzippedFolder, ColumnSortDirection, SearchType } from '@models';

export enum ScenesActionType {
  SET_SCENES = '[Granuels] Set Scenes',
  CLEAR = '[Granuels] Clear Scenes',

  SET_RESULTS_LOADED = '[Scenes] Set Results Loaded',
  LOAD_UNZIPPED_PRODUCT = '[Scenes] Load unzipped product',
  OPEN_UNZIPPED_PRODUCT = '[Scenes] Open unzipped product',
  ADD_UNZIPPED_PRODUCT = '[Scenes] Add unzipped product',
  CLEAR_UNZIPPED_PRODUCTS = '[Scenes] Clear unzipped products',
  ERROR_LOADING_UNZIPPED = '[Scenes] Error loading unzipped',
  CLOSE_ZIP_CONTENTS = '[Scenes] Close Zip Contents',

  SET_SELECTED_SCENE = '[Scenes] Set Selected Scene',
  SELECT_NEXT_SCENE = '[Scenes] Select Next Scene',
  SELECT_PREVIOUS_SCENE = '[Scenes] Select Previous Scene',

  SET_MASTER = '[Scenes-Baseline] Set Master',
  SET_FILTER_MASTER = '[Scenes-Baseline] Set Filter Master',
  CLEAR_BASELINE = '[Scenes-Baseline] Clear Baseline',

  SELECT_NEXT_WITH_BROWSE = '[Scenes] Set next with browse',
  SELECT_PREVIOUS_WITH_BROWSE = '[Scenes] Set previous with browse',

  SET_PERPENDICULAR_SORT_DIRECTION = '[Scenes] Set Perpendicular Sort Direction',
  SET_TEMPORAL_SORT_DIRECTION = '[Scenes] Set Temporal Sort Direction',
}

export class SetScenes implements Action {
  public readonly type = ScenesActionType.SET_SCENES;

  constructor(public payload: {products: CMRProduct[], searchType: SearchType} ) {}
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

export class LoadUnzippedProduct implements Action {
  public readonly type = ScenesActionType.LOAD_UNZIPPED_PRODUCT;

  constructor(public payload: CMRProduct) {}
}

export class OpenUnzippedProduct implements Action {
  public readonly type = ScenesActionType.OPEN_UNZIPPED_PRODUCT;

  constructor(public payload: CMRProduct) {}
}

export class ErrorLoadingUnzipped implements Action {
  public readonly type = ScenesActionType.ERROR_LOADING_UNZIPPED;

  constructor(public payload: CMRProduct) {}
}

export class CloseZipContents implements Action {
  public readonly type = ScenesActionType.CLOSE_ZIP_CONTENTS;

  constructor(public payload: CMRProduct) {}
}

export class AddUnzippedProduct implements Action {
  public readonly type = ScenesActionType.ADD_UNZIPPED_PRODUCT;

  constructor(public payload: { product: CMRProduct, unzipped: UnzippedFolder[] }) {}
}

export class ClearUnzippedProducts implements Action {
  public readonly type = ScenesActionType.CLEAR_UNZIPPED_PRODUCTS;
}

export class SetMaster implements Action {
  public readonly type = ScenesActionType.SET_MASTER;

  constructor(public payload: string) {}
}

export class SetFilterMaster implements Action {
  public readonly type = ScenesActionType.SET_FILTER_MASTER;

  constructor(public payload: string) {}
}

export class ClearBaseline implements Action {
  public readonly type = ScenesActionType.CLEAR_BASELINE;
}

export class SetPerpendicularSortDirection implements Action {
  public readonly type = ScenesActionType.SET_PERPENDICULAR_SORT_DIRECTION;

  constructor(public payload: ColumnSortDirection) {}
}

export class SetTemporalSortDirection implements Action {
  public readonly type = ScenesActionType.SET_TEMPORAL_SORT_DIRECTION;

  constructor(public payload: ColumnSortDirection) {}
}


export type ScenesActions =
  | SetScenes
  | ClearScenes
  | OpenUnzippedProduct
  | AddUnzippedProduct
  | LoadUnzippedProduct
  | CloseZipContents
  | ErrorLoadingUnzipped
  | ClearUnzippedProducts
  | SetSelectedScene
  | SelectNextScene
  | SelectPreviousScene
  | SelectNextWithBrowse
  | SelectPreviousWithBrowse
  | SetResultsLoaded
  | ClearBaseline
  | SetFilterMaster
  | SetMaster
  | SetTemporalSortDirection
  | SetPerpendicularSortDirection;
