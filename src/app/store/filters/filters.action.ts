import { Action } from '@ngrx/store';

import * as models from '@models';

export enum FiltersActionType {
  ADD_SELECTED_PLATFORM = '[Filters-Platform] Add Platform Filter',
  REMOVE_SELECTED_PLATFORM = '[Filters-Platform] Remove Platform Filter',
  SET_SELECTED_PLATFORMS = '[Filters-Platform] Set Selected Platforms',

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

  SET_PLATFORM_PRODUCT_TYPES = '[Filters-Prodcut-Type] Set PLATFORM Product Types',
  SET_ALL_PRODUCT_TYPES = '[Filters-Prodcut-Type] Set All Product Types',

  ADD_BEAM_MODE = '[Filters-Beam-Mode] Add Beam Mode',
  SET_PLATFORM_BEAM_MODES = '[Filters-Beam-Mode] Set Platform Beam Modes',
  SET_ALL_BEAM_MODES= '[Filters-Beam-Mode] Set All Beam Modes',

  SET_PLATFORM_POLARIZATIONS = '[Filters-Polarization] Set Platform Polarizations',
  SET_ALL_POLARIZATIONS = '[Filters-Polarization] Set All Polarizations',

  SET_FLIGHT_DIRECTIONS = '[Filters-Flight-Dir] Set Flight Directions',

  OMIT_SEARCH_POLYGON = '[Filters-Search] Omit Search Polygon',
  USE_SEARCH_POLYGON = '[Filters-Search] Use Search Polygon',

  CLEAR_FILTERS = '[Filters-Clear] Clear Filters',

  SET_LIST_SEARCH_TYPE = '[Filters-List] Set List Search Type',
  SET_MAX_RESULTS = '[Filters] Set Max Results',
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

export class SetPlatformProductTypes implements Action {
  public readonly type = FiltersActionType.SET_PLATFORM_PRODUCT_TYPES;

  constructor(public payload: models.PlatformProductTypes) {}
}

export class SetAllProductTypes implements Action {
  public readonly type = FiltersActionType.SET_ALL_PRODUCT_TYPES;

  constructor(public payload: models.PlatformProductTypes) {}
}

export class SetListSearchType implements Action {
  public readonly type = FiltersActionType.SET_LIST_SEARCH_TYPE;

  constructor(public payload: models.ListSearchType) {}
}

export class ClearFilters implements Action {
  public readonly type = FiltersActionType.CLEAR_FILTERS;
}

export class SetFlightDirections implements Action {
  public readonly type = FiltersActionType.SET_FLIGHT_DIRECTIONS;

  constructor(public payload: models.FlightDirection[]) {}
}

export class AddBeamMode implements Action {
  public readonly type = FiltersActionType.ADD_BEAM_MODE;

  constructor(public payload: string) {}
}

export class SetPlatformBeamModes implements Action {
  public readonly type = FiltersActionType.SET_PLATFORM_BEAM_MODES;

  constructor(public payload: models.PlatformBeamModes) {}
}

export class SetAllBeamModes implements Action {
  public readonly type = FiltersActionType.SET_ALL_BEAM_MODES;

  constructor(public payload: models.PlatformBeamModes) {}
}

export class SetPlatformPolarizations implements Action {
  public readonly type = FiltersActionType.SET_PLATFORM_POLARIZATIONS;

  constructor(public payload: models.PlatformPolarizations) {}
}

export class SetAllPolarizations implements Action {
  public readonly type = FiltersActionType.SET_ALL_POLARIZATIONS;

  constructor(public payload: models.PlatformPolarizations) {}
}

export class SetMaxResults implements Action {
  public readonly type = FiltersActionType.SET_MAX_RESULTS;

  constructor(public payload: number) {}
}

export type FiltersActions =
  | AddSelectedPlatform
  | RemoveSelectedPlatform
  | SetSelectedPlatforms
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
  | SetPlatformProductTypes
  | SetAllProductTypes
  | SetListSearchType
  | SetFlightDirections
  | AddBeamMode
  | SetPlatformBeamModes
  | SetAllBeamModes
  | SetPlatformPolarizations
  | SetAllPolarizations
  | ClearFilters
  | SetMaxResults;
