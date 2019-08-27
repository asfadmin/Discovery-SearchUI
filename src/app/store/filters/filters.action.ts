import { Action } from '@ngrx/store';

import * as models from '@models';

export enum FiltersActionType {
  SET_SELECTED_DATASET = '[Filters-Dataset] Set Selected Dataset',
  SET_STATE = '[Filters-Date] Set State',

  SET_START_DATE = '[Filters-Date] Set Start Date',
  SET_END_DATE = '[Filters-Date] Set End Date',
  CLEAR_DATE_RANGE = '[Filters-Date] Clear Date Range',

  SET_SEASON_START = '[Filters-Date] Set Season Start',
  SET_SEASON_END = '[Filters-Date] Set Season End',
  CLEAR_SEASON = '[Filters-Date] Clear Season',

  SET_PATH_START = '[Filters-Path] Set Path Start',
  SET_PATH_END = '[Filters-Path] Set Path End',
  SET_FRAME_START = '[FIlters-Frame] Set Frame Start',
  SET_FRAME_END = '[Filters-Frame] Set Frame End',

  SET_PRODUCT_TYPES = '[Filters-Prodcut-Type] Set DATASET Product Types',

  ADD_BEAM_MODE = '[Filters-Beam-Mode] Add Beam Mode',
  SET_BEAM_MODES = '[Filters-Beam-Mode] Set Dataset Beam Modes',

  ADD_POLARIZATION = '[Filters-Beam-Mode] Add Polarization',
  SET_POLARIZATIONS = '[Filters-Polarization] Set Dataset Polarizations',

  ADD_FLIGHT_DIRECTION = '[Filters-Flight-Dir] Add Flight Direction',
  SET_FLIGHT_DIRECTIONS = '[Filters-Flight-Dir] Set Flight Directions',

  ADD_SUBTYPE = '[Filters-Subtype] Add Dataset Subtype',
  SET_SUBTYPES = '[Filters-Subtype] Set Subtypes',

  OMIT_SEARCH_POLYGON = '[Filters-Search] Omit Search Polygon',
  USE_SEARCH_POLYGON = '[Filters-Search] Use Search Polygon',

  CLEAR_DATASET_FILTERS = '[Filters-Clear] Clear Dataset Filters',
  CLEAR_LIST_FILTERS = '[Filters-Clear] Clear List Filters',

  SET_LIST_SEARCH_TYPE = '[Filters-List] Set List Search Type',
  SET_SEARCH_LIST = '[Filters-List] Set Search List',

  SET_MAX_RESULTS = '[Filters] Set Max Results',
}

export class SetState implements Action {
  public readonly type = FiltersActionType.SET_STATE;

  constructor(public payload: any) {}
}

export class SetSelectedDataset implements Action {
  public readonly type = FiltersActionType.SET_SELECTED_DATASET;

  constructor(public payload: string) {}
}

export class SetStartDate implements Action {
  public readonly type = FiltersActionType.SET_START_DATE;

  constructor(public payload: Date) {}
}

export class SetEndDate implements Action {
  public readonly type = FiltersActionType.SET_END_DATE;

  constructor(public payload: Date) {}
}

export class SetSeasonStart implements Action {
  public readonly type = FiltersActionType.SET_SEASON_START;

  constructor(public payload: number | null) {}
}

export class SetSeasonEnd implements Action {
  public readonly type = FiltersActionType.SET_SEASON_END;

  constructor(public payload: number | null) {}
}

export class ClearSeason implements Action {
  public readonly type = FiltersActionType.CLEAR_SEASON;
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

export class SetProductTypes implements Action {
  public readonly type = FiltersActionType.SET_PRODUCT_TYPES;

  constructor(public payload: models.DatasetProductTypes) {}
}

export class SetListSearchType implements Action {
  public readonly type = FiltersActionType.SET_LIST_SEARCH_TYPE;

  constructor(public payload: models.ListSearchType) {}
}

export class ClearDatasetFilters implements Action {
  public readonly type = FiltersActionType.CLEAR_DATASET_FILTERS;
}

export class ClearListFilters implements Action {
  public readonly type = FiltersActionType.CLEAR_LIST_FILTERS;
}

export class AddFlightDirection implements Action {
  public readonly type = FiltersActionType.ADD_FLIGHT_DIRECTION;

  constructor(public payload: models.FlightDirection) {}
}

export class SetFlightDirections implements Action {
  public readonly type = FiltersActionType.SET_FLIGHT_DIRECTIONS;

  constructor(public payload: models.FlightDirection[]) {}
}

export class AddBeamMode implements Action {
  public readonly type = FiltersActionType.ADD_BEAM_MODE;

  constructor(public payload: string) {}
}

export class SetBeamModes implements Action {
  public readonly type = FiltersActionType.SET_BEAM_MODES;

  constructor(public payload: models.DatasetBeamModes) {}
}

export class AddPolarization implements Action {
  public readonly type = FiltersActionType.ADD_POLARIZATION;

  constructor(public payload: string) {}
}

export class SetPolarizations implements Action {
  public readonly type = FiltersActionType.SET_POLARIZATIONS;

  constructor(public payload: models.DatasetPolarizations) {}
}

export class AddSubtype implements Action {
  public readonly type = FiltersActionType.ADD_SUBTYPE;

  constructor(public payload: models.DatasetSubtype) {}
}

export class SetSubtypes implements Action {
  public readonly type = FiltersActionType.SET_SUBTYPES;

  constructor(public payload: models.DatasetSubtypes) {}
}

export class SetSearchList implements Action {
  public readonly type = FiltersActionType.SET_SEARCH_LIST;

  constructor(public payload: string[]) {}
}

export class SetMaxResults implements Action {
  public readonly type = FiltersActionType.SET_MAX_RESULTS;

  constructor(public payload: number) {}
}

export type FiltersActions =
  | SetState
  | SetSelectedDataset
  | SetStartDate
  | SetEndDate
  | SetSeasonStart
  | SetSeasonEnd
  | ClearSeason
  | ClearDateRange
  | OmitSearchPolygon
  | UseSearchPolygon
  | SetPathStart
  | SetPathEnd
  | SetFrameStart
  | SetFrameEnd
  | SetProductTypes
  | SetListSearchType
  | SetSearchList
  | SetFlightDirections
  | AddFlightDirection
  | AddBeamMode
  | SetBeamModes
  | AddSubtype
  | SetSubtypes
  | AddPolarization
  | SetPolarizations
  | ClearDatasetFilters
  | ClearListFilters
  | SetMaxResults;
