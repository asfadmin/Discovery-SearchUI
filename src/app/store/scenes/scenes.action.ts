import { Action } from '@ngrx/store';

import {
  CMRProduct,
  ColumnSortDirection,
  SearchType,
  CMRProductPair,
  CMRProductsById,
} from '@models';

export enum ScenesActionType {
  SET_SCENES = '[Granules] Set Scenes',
  CLEAR = '[Granules] Clear Scenes',
  SET_DISPLACEMENT_PRODUCTS = '[Timeseries] Set Selected Timeseries Products',

  SET_RESULTS_LOADED = '[Scenes] Set Results Loaded',

  ADD_CMR_DATA_TO_ON_DEMAND_JOBS = '[Scenes] Add CMR Data to On Demand Jobs',
  UPDATE_PRODUCT_WITH_NEW_PROJECT_NAME = '[Scenes] Update product with new project name',

  SET_SELECTED_SCENE = '[Scenes] Set Selected Scene',
  SET_SELECTED_PAIR = '[Scenes] Set Selected Pair',

  SET_MASTER = '[Scenes-Baseline] Set Master',
  SET_FILTER_MASTER = '[Scenes-Baseline] Set Filter Master',
  CLEAR_BASELINE = '[Scenes-Baseline] Clear Baseline',

  SET_PERPENDICULAR_SORT_DIRECTION = '[Scenes] Set Perpendicular Sort Direction',
  SET_TEMPORAL_SORT_DIRECTION = '[Scenes] Set Temporal Sort Direction',

  ADD_CUSTOM_PAIR = '[Scenes] Add Custom Pair',
  ADD_CUSTOM_PAIRS = '[Scenes] Add Custom Pairs',
  REMOVE_CUSTOM_PAIR = '[Scenes] Remove Custom Pair',
}

export class SetScenes implements Action {
  public readonly type = ScenesActionType.SET_SCENES;

  constructor(
    public payload: { products: CMRProduct[]; searchType: SearchType },
  ) {}
}

export class ClearScenes implements Action {
  public readonly type = ScenesActionType.CLEAR;
}

export class SetResultsLoaded implements Action {
  public readonly type = ScenesActionType.SET_RESULTS_LOADED;

  constructor(public payload: boolean) {}
}

export class SetSelectedScene implements Action {
  public readonly type = ScenesActionType.SET_SELECTED_SCENE;

  constructor(public payload: string) {}
}

export class SetSelectedPair implements Action {
  public readonly type = ScenesActionType.SET_SELECTED_PAIR;

  constructor(public payload: string[]) {}
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

export class AddCustomPair implements Action {
  public readonly type = ScenesActionType.ADD_CUSTOM_PAIR;

  constructor(public payload: string[]) {}
}

export class AddCustomPairs implements Action {
  public readonly type = ScenesActionType.ADD_CUSTOM_PAIRS;

  constructor(public payload: string[][]) {}
}

export class RemoveCustomPair implements Action {
  public readonly type = ScenesActionType.REMOVE_CUSTOM_PAIR;

  constructor(public payload: CMRProductPair | string[]) {}
}

export class AddCmrDataToOnDemandScenes implements Action {
  public readonly type = ScenesActionType.ADD_CMR_DATA_TO_ON_DEMAND_JOBS;

  constructor(public payload: CMRProductsById) {}
}

export class UpdateProductWithNewProjectName implements Action {
  public readonly type = ScenesActionType.UPDATE_PRODUCT_WITH_NEW_PROJECT_NAME;

  constructor(public payload: { productId: string; name: string }) {}
}

export type ScenesActions =
  | SetScenes
  | ClearScenes
  | SetSelectedScene
  | SetSelectedPair
  | SetResultsLoaded
  | ClearBaseline
  | SetFilterMaster
  | SetMaster
  | SetTemporalSortDirection
  | SetPerpendicularSortDirection
  | AddCustomPair
  | AddCustomPairs
  | RemoveCustomPair
  | AddCmrDataToOnDemandScenes
  | UpdateProductWithNewProjectName;
