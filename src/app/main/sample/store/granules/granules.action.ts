import { Action } from '@ngrx/store';

import { SentinelGranule } from './../../models';

export enum GranulesActionType {
  QUERY = '[Asf Api] Query Api',
  QUERY_ERROR = '[Asf Api] Query failed',

  SET = '[Granuels] Set Granules',
  CLEAR = '[Granuels] Clear Granules',
}

export class QueryApi implements Action {
  public readonly type = GranulesActionType.QUERY;

  constructor(public payload: string) {}
}

export class QueryError implements Action {
  public readonly type = GranulesActionType.QUERY_ERROR;

  constructor(public payload: string) {}
}

export class SetGranules implements Action {
  public readonly type = GranulesActionType.SET;

  constructor(public payload: SentinelGranule[]) {}
}

export class ClearGranules implements Action {
  public readonly type = GranulesActionType.CLEAR;
}

export type GranulesActions =
  | QueryApi
  | QueryError
  | SetGranules
  | ClearGranules;

