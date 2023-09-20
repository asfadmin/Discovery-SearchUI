import { Action } from '@ngrx/store';

import * as models from '@models';
import { EventProductSort, SBASOverlap } from '@models';

export enum FiltersActionType {
  SET_SELECTED_DATASET = '[Filters-Dataset] Set Selected Dataset',

  SET_TEMPORAL_START = '[Filters-Temporal] Set Temporal Start',
  SET_TEMPORAL_END = '[Filters-Temporal] Set Temporal End',
  SET_TEMPORAL_RANGE = '[Filters-Temporal] Set Temporal Range',
  CLEAR_TEMPORAL_RANGE = '[Filters-Temporal] Clear Date Range',

  SET_PERPENDICULAR_START = '[Filters-Perp] Set Perpendicular Start',
  SET_PERPENDICULAR_END  = '[Filters-Perp] Set Perpendicular End',
  SET_PERPENDICULAR_RANGE = '[Filters-Perp] Set Perpendicular Range',
  CLEAR_PERPENDICULAR_RANGE = '[Filters-Perp] Clear Perpendicular Range',

  SET_START_DATE = '[Filters-Date] Set Start Date',
  SET_END_DATE = '[Filters-Date] Set End Date',
  CLEAR_DATE_RANGE = '[Filters-Date] Clear Date Range',

  SET_SEASON_START = '[Filters-Date] Set Season Start',
  SET_SEASON_END = '[Filters-Date] Set Season End',
  CLEAR_SEASON = '[Filters-Date] Clear Season',

  SET_PATH_START = '[Filters-Path] Set Path Start',
  SET_PATH_END = '[Filters-Path] Set Path End',
  CLEAR_PATH_RANGE = '[Filter-Path] Clear Path Range',

  SET_FRAME_START = '[FIlters-Frame] Set Frame Start',
  SET_FRAME_END = '[Filters-Frame] Set Frame End',
  CLEAR_FRAME_RANGE = '[Filter-Frame] Clear Frame Range',

  SET_FILTERS_SIMILAR_TO = '[Filters] Set Filters Similar To',

  SET_PRODUCT_TYPES = '[Filters-Product-Type] Set DATASET Product Types',

  ADD_BEAM_MODE = '[Filters-Beam-Mode] Add Beam Mode',
  SET_BEAM_MODES = '[Filters-Beam-Mode] Set Dataset Beam Modes',

  ADD_POLARIZATION = '[Filters-Polarization] Add Polarization',
  SET_POLARIZATIONS = '[Filters-Polarization] Set Dataset Polarizations',

  SET_JOB_STATUSES = '[Filters-Job-Status] Set Job Statuses',

  SET_FLIGHT_DIRECTIONS = '[Filters-Flight-Dir] Set Flight Directions',

  SET_SUBTYPES = '[Filters-Subtype] Set Subtypes',

  OMIT_SEARCH_POLYGON = '[Filters-Search] Omit Search Polygon',
  USE_SEARCH_POLYGON = '[Filters-Search] Use Search Polygon',

  CLEAR_DATASET_FILTERS = '[Filters-Clear] Clear Dataset Filters',
  CLEAR_LIST_FILTERS = '[Filters-Clear] Clear List Filters',

  SET_LIST_SEARCH_TYPE = '[Filters-List] Set List Search Type',
  SET_SEARCH_LIST = '[Filters-List] Set Search List',

  SET_MISSIONS = '[Filters-Mission] Set Missions',

  SELECT_MISSION = '[Filters-Mission] Select Mission',

  SET_MAX_RESULTS = '[Filters] Set Max Results',
  SET_SAVED_SEARCH = '[Filters] Set Saved Search',
  SET_PROJECT_NAME = '[Filters] Set Project Name',

  SET_PRODUCT_NAME_FILTER = '[Filters] Set Product Name Filter',

  RESTORE_FILTERS = '[Filters] Restores Previous Filters',
  STORE_CURRENT_FILTERS = '[Filters] Stores Current Filters',

  TOGGLE_50_PERCENT_OVERLAP = '[Filters] Toggles SBAS 50 Percent Overlap Check',
  SET_SBAS_OVERLAP_THRESHOLD = '[Filters] Set SBAS Pair Overlap Threshold',
  SET_DEFAULT_FILTERS = '[Filters] Set User Profile Default Filters',

  SET_SARVIEWS_EVENT_TYPES = '[Filters] Set SARViews event types',
  SET_SARVIEWS_EVENT_NAME_FILTER = '[Filters] Set SARViews event name filter',
  SET_SARVIEWS_EVENT_ACTIVE_FILTER = '[Filters] Set SARViews event active processing filter',
  SET_SARVIEWS_MAGNITUDE_START = '[Filters] Set SARViews quake event magnitude range filter start',
  SET_SARVIEWS_MAGNITUDE_END = '[Filters] Set SARViews quake event magnitude range filter end',
  SET_SARVIEWS_MAGNITUDE_RANGE = '[Filters] Set SARViews quake event magnitude range filter',
  CLEAR_SARVIEWS_MAGNITUDE_RANGE = '[Filters] Clear SARViews quake event magnitude range',

  SET_HYP3_PRODUCT_TYPES = '[Filters] Set Hyp3 product types filter',
  SET_EVENT_PRODUCT_SORT = '[Filters] Set event product sorting order',

  CLEAR_EVENT_FILTERS = '[Filters] Clear Event Search Filters',
  CLEAR_HYP3_PRODUCT_TYPES = '[Filters] Clear Hyp3 product types filter',

  SET_GEOCODE = '[Filters] Set geocode area name',

  SET_FULL_BURST = '[Filters] Set Full Burst IDs',
  
  SET_OPERA_BURST_ID = '[Filters] Set Full OPERA S1 Burst IDs'
}

export class SetSelectedDataset implements Action {
  public readonly type = FiltersActionType.SET_SELECTED_DATASET;

  constructor(public payload: string) {}
}

export class SetPerpendicularStart implements Action {
  public readonly type = FiltersActionType.SET_PERPENDICULAR_START;

  constructor(public payload: number) {}
}

export class SetPerpendicularEnd  implements Action {
  public readonly type = FiltersActionType.SET_PERPENDICULAR_END;

  constructor(public payload: number) {}
}

export class ClearPerpendicularRange implements Action {
  public readonly type = FiltersActionType.CLEAR_PERPENDICULAR_RANGE;
}

export class SetPerpendicularRange  implements Action {
  public readonly type = FiltersActionType.SET_PERPENDICULAR_RANGE;

  constructor(public payload: models.Range<number>) {}
}

export class SetTemporalStart implements Action {
  public readonly type = FiltersActionType.SET_TEMPORAL_START;

  constructor(public payload: number) {}
}

export class SetTemporalEnd  implements Action {
  public readonly type = FiltersActionType.SET_TEMPORAL_END;

  constructor(public payload: number) {}
}

export class SetTemporalRange  implements Action {
  public readonly type = FiltersActionType.SET_TEMPORAL_RANGE;

  constructor(public payload: models.Range<number>) {}
}

export class ClearTemporalRange implements Action {
  public readonly type = FiltersActionType.CLEAR_TEMPORAL_RANGE;
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

export class ClearPathRange implements Action {
  public readonly type = FiltersActionType.CLEAR_PATH_RANGE;
}

export class SetFrameStart implements Action {
  public readonly type = FiltersActionType.SET_FRAME_START;

  constructor(public payload: number) {}
}

export class SetFrameEnd implements Action {
  public readonly type = FiltersActionType.SET_FRAME_END;

  constructor(public payload: number) {}
}

export class ClearFrameRange implements Action {
  public readonly type = FiltersActionType.CLEAR_FRAME_RANGE;
}

export class SetFiltersSimilarTo implements Action {
  public readonly type = FiltersActionType.SET_FILTERS_SIMILAR_TO;

  constructor(public payload: {product: models.CMRProduct, dataset: models.Dataset}) {}
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

export class SetFlightDirections implements Action {
  public readonly type = FiltersActionType.SET_FLIGHT_DIRECTIONS;

  constructor(public payload: models.FlightDirection[]) {}
}
export class SetJobStatuses implements Action {
  public readonly type = FiltersActionType.SET_JOB_STATUSES;

  constructor(public payload: models.Hyp3JobStatusCode[]) {}
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

export class SetSubtypes implements Action {
  public readonly type = FiltersActionType.SET_SUBTYPES;

  constructor(public payload: models.DatasetSubtypes) {}
}

export class SetSearchList implements Action {
  public readonly type = FiltersActionType.SET_SEARCH_LIST;

  constructor(public payload: string[]) {}
}

export class SetMissions implements Action {
  public readonly type = FiltersActionType.SET_MISSIONS;

  constructor(public payload: {[dataset: string]: string[]}) {}
}

export class SelectMission implements Action {
  public readonly type = FiltersActionType.SELECT_MISSION;

  constructor(public payload: string) {}
}
export class SetSavedSearch implements Action {
  public readonly type = FiltersActionType.SET_SAVED_SEARCH;

  constructor(public payload: models.Search) {}
}

export class SetMaxResults implements Action {
  public readonly type = FiltersActionType.SET_MAX_RESULTS;

  constructor(public payload: number) {}
}

export class SetProjectName implements Action {
  public readonly type = FiltersActionType.SET_PROJECT_NAME;

  constructor(public payload: string) {}
}

export class SetProductNameFilter implements Action {
  public readonly type = FiltersActionType.SET_PRODUCT_NAME_FILTER;

  constructor(public payload: string) {}
}

export class RestoreFilters implements Action {
  public readonly type = FiltersActionType.RESTORE_FILTERS;

  constructor() {}
}

export class StoreCurrentFilters implements Action {
  public readonly type = FiltersActionType.STORE_CURRENT_FILTERS;

  constructor() {}
}

export class Toggle50PercentOverlap implements Action {
  public readonly type = FiltersActionType.TOGGLE_50_PERCENT_OVERLAP;

  constructor() {}
}

export class SetSBASOverlapThreshold implements Action {
  public readonly type = FiltersActionType.SET_SBAS_OVERLAP_THRESHOLD;

  constructor(public payload: SBASOverlap) {}
}

export class SetSarviewsEventTypes implements Action {
  public readonly type = FiltersActionType.SET_SARVIEWS_EVENT_TYPES;

  constructor(public payload: models.SarviewsEventType[]) {}
}

export class SetSarviewsEventNameFilter implements Action {
  public readonly type = FiltersActionType.SET_SARVIEWS_EVENT_NAME_FILTER;

  constructor(public payload: string) {}
}

export class SetSarviewsEventActiveFilter implements Action {
  public readonly type = FiltersActionType.SET_SARVIEWS_EVENT_ACTIVE_FILTER;

  constructor(public payload: boolean) {}
}

export class SetSarviewsMagnitudeStart implements Action {
  public readonly type = FiltersActionType.SET_SARVIEWS_MAGNITUDE_START;

  constructor(public payload: number) {}
}

export class SetSarviewsMagnitudeEnd implements Action {
  public readonly type = FiltersActionType.SET_SARVIEWS_MAGNITUDE_END;

  constructor(public payload: number) {}
}

export class SetSarviewsMagnitudeRange implements Action {
  public readonly type = FiltersActionType.SET_SARVIEWS_MAGNITUDE_RANGE;

  constructor(public payload: models.Range<number>) {}
}

export class ClearSarviewsMagnitudeRange implements Action {
  public readonly type = FiltersActionType.CLEAR_SARVIEWS_MAGNITUDE_RANGE;
}

export class SetHyp3ProductTypes implements Action {
  public readonly type = FiltersActionType.SET_HYP3_PRODUCT_TYPES;

  constructor(public payload: string[]) {}
}

export class SetEventProductSorting implements Action {
  public readonly type = FiltersActionType.SET_EVENT_PRODUCT_SORT;

  constructor(public payload: EventProductSort) {}
}

export class SetDefaultFilters implements Action {
  public readonly type = FiltersActionType.SET_DEFAULT_FILTERS;
  constructor(public payload: {
    'Baseline Search': string,
    'Geographic Search': string,
    'SBAS Search': string
  }) {}
}

export class SetGeocode implements Action {
  public readonly type = FiltersActionType.SET_GEOCODE;

  constructor(public payload: string) {}
}

export class ClearEventFilters implements Action {
  public readonly type = FiltersActionType.CLEAR_EVENT_FILTERS;

  constructor() {}
}

export class ClearHyp3ProductTypes implements Action {
  public readonly type = FiltersActionType.CLEAR_HYP3_PRODUCT_TYPES;

  constructor() {}
}

export class setFullBurst implements Action {
  public readonly type = FiltersActionType.SET_FULL_BURST;

  constructor(public payload: string[]) {}
}

export class setOperaBurstID implements Action {
  public readonly type = FiltersActionType.SET_OPERA_BURST_ID;

  constructor(public payload: string[]) {}
}



export type FiltersActions =
  | SetSelectedDataset
  | SetPerpendicularStart
  | SetPerpendicularEnd
  | SetPerpendicularRange
  | ClearPerpendicularRange
  | SetTemporalStart
  | SetTemporalEnd
  | SetTemporalRange
  | ClearTemporalRange
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
  | ClearPathRange
  | SetFrameStart
  | SetFrameEnd
  | SetFiltersSimilarTo
  | ClearFrameRange
  | SetProductTypes
  | SetListSearchType
  | SetSearchList
  | SetFlightDirections
  | AddBeamMode
  | SetBeamModes
  | SetJobStatuses
  | SetSubtypes
  | AddPolarization
  | SetPolarizations
  | ClearDatasetFilters
  | ClearListFilters
  | SetMissions
  | SelectMission
  | SetSavedSearch
  | SetMaxResults
  | SetProjectName
  | SetProductNameFilter
  | RestoreFilters
  | StoreCurrentFilters
  | Toggle50PercentOverlap
  | SetSBASOverlapThreshold
  | SetDefaultFilters
  | SetSarviewsEventTypes
  | SetSarviewsEventNameFilter
  | SetSarviewsEventActiveFilter
  | SetSarviewsMagnitudeStart
  | SetSarviewsMagnitudeEnd
  | SetSarviewsMagnitudeRange
  | SetGeocode
  | ClearSarviewsMagnitudeRange
  | SetHyp3ProductTypes
  | SetEventProductSorting
  | ClearEventFilters
  | ClearHyp3ProductTypes
  | setFullBurst
  | setOperaBurstID;
