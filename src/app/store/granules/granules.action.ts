import { Action } from '@ngrx/store';

import { Sentinel1Product } from '@models';

export enum GranulesActionType {
  QUERY = '[Asf Api] Query Api',
  QUERY_ERROR = '[Asf Api] Query failed',

  SET_GRANULES = '[Granuels] Set Granules',
  CLEAR = '[Granuels] Clear Granules',

  SET_SELECTED = '[Granules] Set Selected Granule',

  SET_GRANULE_SEARCH_LIST = '[Granules] Set Granule Search List',
}

export class QueryApi implements Action {
  public readonly type = GranulesActionType.QUERY;

  constructor() {}
}

export class QueryError implements Action {
  public readonly type = GranulesActionType.QUERY_ERROR;

  constructor(public payload: string) {}
}

export class SetGranules implements Action {
  public readonly type = GranulesActionType.SET_GRANULES;

  constructor(public payload: Sentinel1Product[]) {}
}

export class ClearGranules implements Action {
  public readonly type = GranulesActionType.CLEAR;
}

export class SetSelectedGranule implements Action {
  public readonly type = GranulesActionType.SET_SELECTED;

  constructor(public payload: string) {}
}

export class SetGranuleSearchList implements Action {
  public readonly type = GranulesActionType.SET_GRANULE_SEARCH_LIST;

  constructor(public payload: string[]) {}
}

export type GranulesActions =
  | QueryApi
  | QueryError
  | SetGranules
  | ClearGranules
  | SetSelectedGranule
  | SetGranuleSearchList;
