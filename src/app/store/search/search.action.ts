import { Action } from '@ngrx/store';

import { CMRProduct, SarviewsEvent, SearchType } from '@models';

export enum SearchActionType {
  MAKE_SEARCH = '[Search] Make A Search',
  SEARCH_RESPONSE = '[Search] Search Response',
  SEARCH_ERROR = '[Search] Search Error',
  CANCEL_SEARCH = '[Search] Cancel Search',
  SEARCH_CANCELED = '[Search] Search Canceled',

  CLEAR_SEARCH = '[Search] Clear Search',

  ENABLE_SEARCH = '[Search] Enable Search',
  DISABLE_SEARCH = '[Search] Disable Search',

  SET_NEXT_JOBS_URL = '[Search] Sets the next url to search for user jobs',
  HYP3_BATCH_RESPONSE = '[Search] Hyp3 Response Batch',
  SET_SEARCH_AMOUNT = '[Search] Set Search Results Amount',
  SEARCH_AMOUNT_LOADING = '[Search] Search Amount Is Loading',
  SET_SEARCH_TYPE = '[UI] Set Search Type',
  SET_SEARCH_TYPE_AFTER_SAVE = '[UI] Set Search Type After Save',
  LOAD_ON_DEMAND_SCENES_LIST = '[Search] Load on Demand Scenes List',

  SARVIEWS_SEARCH_RESPONSE = '[Search] SARViews Search Response',
  TIMESERIES_SEARCH_RESPONSE = '[Search] Timeseries Search Response',
  MAKE_EVENT_PRODUCT_CMR_SEARCH = '[Search] Make a search for CMR Products with SARVIEWS Products',
  EVENT_PRODUCT_CMR_RESPONSE = '[Search] Event Monitoring CMR Search Response',
  SET_SEARCH_OUT_OF_DATE = '[Search] Set if Search is Out of Date'
}

export class MakeSearch implements Action {
  public readonly type = SearchActionType.MAKE_SEARCH;
}

export class CancelSearch implements Action {
  public readonly type = SearchActionType.CANCEL_SEARCH;
}

export class ClearSearch implements Action {
  public readonly type = SearchActionType.CLEAR_SEARCH;
}

export class SearchCanceled implements Action {
  public readonly type = SearchActionType.SEARCH_CANCELED;
}

export class EnableSearch implements Action {
  public readonly type = SearchActionType.ENABLE_SEARCH;
}

export class DisableSearch implements Action {
  public readonly type = SearchActionType.DISABLE_SEARCH;
}

export class SearchAmountLoading implements Action {
  public readonly type = SearchActionType.SEARCH_AMOUNT_LOADING;
}

export class SetSearchAmount implements Action {
  public readonly type = SearchActionType.SET_SEARCH_AMOUNT;

  constructor(public payload: number) {}
}

export class SearchResponse implements Action {
  public readonly type = SearchActionType.SEARCH_RESPONSE;

  constructor(public payload: {files: CMRProduct[], totalCount?: number, searchType: SearchType, next?: string}) {}
}

export class SarviewsEventsResponse implements Action {
  public readonly type = SearchActionType.SARVIEWS_SEARCH_RESPONSE;

  constructor(public payload: {events: SarviewsEvent[]}) {}
}

export class TimeseriesSearchResponse implements Action {
  public readonly type = SearchActionType.TIMESERIES_SEARCH_RESPONSE;

  constructor(public payload: any) {}
}

export class SearchError implements Action {
  public readonly type = SearchActionType.SEARCH_ERROR;

  constructor(public payload: string) {}
}

export class SetNextJobsUrl implements Action {
  public readonly type = SearchActionType.SET_NEXT_JOBS_URL;

  constructor(public payload: string) {}
}

export class Hyp3BatchResponse implements Action {
  public readonly type = SearchActionType.HYP3_BATCH_RESPONSE;

  constructor(public payload: {files: CMRProduct[], totalCount: number, searchType: SearchType, next: string}) {}
}

export class SetSearchType implements Action {
  public readonly type = SearchActionType.SET_SEARCH_TYPE;

  constructor(public payload: SearchType) {}
}

export class SetSearchTypeAfterSave implements Action {
  public readonly type = SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE;

  constructor(public payload: SearchType) {}
}

export class LoadOnDemandScenesList implements Action {
  public readonly type = SearchActionType.LOAD_ON_DEMAND_SCENES_LIST;

  constructor(public payload: CMRProduct[]) {}
}

export class SetSearchOutOfDate implements Action {
  public readonly type = SearchActionType.SET_SEARCH_OUT_OF_DATE;

  constructor(public payload: boolean) {}
}

export type SearchActions =
  | MakeSearch
  | SetSearchAmount
  | CancelSearch
  | ClearSearch
  | EnableSearch
  | DisableSearch
  | SearchAmountLoading
  | SearchError
  | SearchResponse
  | SetNextJobsUrl
  | Hyp3BatchResponse
  | SetSearchType
  | LoadOnDemandScenesList
  | SetSearchTypeAfterSave
  | SarviewsEventsResponse
  | TimeseriesSearchResponse
  | SetSearchOutOfDate;
