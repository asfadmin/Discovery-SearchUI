import { Action } from '@ngrx/store';

import { ListSearchType, PlatformProductType, PlatformProductTypes } from '@models';

export enum FiltersActionType {
  ADD_SELECTED_PLATFORM = '[Filters-Platform] Add Platform Filter',
  REMOVE_SELECTED_PLATFORM = '[Filters-Platform] Remove Platform Filter',
  SET_SELECTED_PLATFORMS = '[Filters-Platform] Set Selected Platforms',

  SET_START_DATE = '[Filters-Date] Set Start Date',
  SET_END_DATE = '[Filters-Date] Set End Date',
  CLEAR_DATE_RANGE = '[Filters-Date] Clear Date Range',

  SET_PATH_START = '[Filters-Path] Set Path Start',
  SET_PATH_END = '[Filters-Path] Set Path End',
  SET_FRAME_START = '[FIlters-Frame] Set Frame Start',
  SET_FRAME_END = '[Filters-Frame] Set Frame End',

  ADD_PRODUCT_TYPE = '[Filters-Product-Type] Add Product Type',
  REMOVE_PRODUCT_TYPE = '[Filters-Product-Type] Remove Product Type',
  SET_PRODUCT_TYPES = '[Filters-Prodcut-Type] Set Product Types',

  OMIT_SEARCH_POLYGON = '[Filters-Search] Omit Search Polygon',
  USE_SEARCH_POLYGON = '[Filters-Search] Use Search Polygon',

  CLEAR_FILTERS = '[Filters-Clear] Clear Filters',

  SET_LIST_SEARCH_TYPE = '[Filtesr-List] Set List Search Type',
}

export class AddSelectedPlatform implements Action {
  public readonly type = FiltersActionType.ADD_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}

export class RemoveSelectedPlatform implements Action {
  public readonly type = FiltersActionType.REMOVE_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}

export class SetSelectedPlatforms implements Action {
  public readonly type = FiltersActionType.SET_SELECTED_PLATFORMS;

  constructor(public payload: string[]) {}
}

export class SetStartDate implements Action {
  public readonly type = FiltersActionType.SET_START_DATE;

  constructor(public payload: Date) {}
}

export class SetEndDate implements Action {
  public readonly type = FiltersActionType.SET_END_DATE;

  constructor(public payload: Date) {}
}

export class ClearDateRange implements Action {
  public readonly type = FiltersActionType.CLEAR_DATE_RANGE;
}

export class OmitSearchPolygon implements Action {
  public readonly type = FiltersActionType.OMIT_SEARCH_POLYGON;
}

export class UseSearchPolygon implements Action {
  public readonly type = FiltersActionType.USE_SEARCH_POLYGON;
}

export class SetPathStart implements Action {
  public readonly type = FiltersActionType.SET_PATH_START;

  constructor(public payload: number) {}
}

export class SetPathEnd implements Action {
  public readonly type = FiltersActionType.SET_PATH_END;

  constructor(public payload: number) {}
}

export class SetFrameStart implements Action {
  public readonly type = FiltersActionType.SET_FRAME_START;

  constructor(public payload: number) {}
}

export class SetFrameEnd implements Action {
  public readonly type = FiltersActionType.SET_FRAME_END;

  constructor(public payload: number) {}
}

export class AddProductType implements Action {
  public readonly type = FiltersActionType.ADD_PRODUCT_TYPE;

  constructor(public payload: PlatformProductType) {}
}

export class RemoveProductType implements Action {
  public readonly type = FiltersActionType.REMOVE_PRODUCT_TYPE;

  constructor(public payload: PlatformProductType) {}
}

export class SetProductTypes implements Action {
  public readonly type = FiltersActionType.SET_PRODUCT_TYPES;

  constructor(public payload: PlatformProductTypes) {}
}

export class SetListSearchType implements Action {
  public readonly type = FiltersActionType.SET_LIST_SEARCH_TYPE;

  constructor(public payload: ListSearchType) {}
}

export class ClearFilters implements Action {
  public readonly type = FiltersActionType.CLEAR_FILTERS;
}


export type FiltersActions =
  | AddSelectedPlatform
  | RemoveSelectedPlatform
  | SetSelectedPlatforms
  | SetStartDate
  | SetEndDate
  | ClearDateRange
  | OmitSearchPolygon
  | UseSearchPolygon
  | SetPathStart
  | SetPathEnd
  | SetFrameStart
  | SetFrameEnd
  | AddProductType
  | RemoveProductType
  | SetProductTypes
  | SetListSearchType
  | ClearFilters;
