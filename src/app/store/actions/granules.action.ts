import { Action } from '@ngrx/store';

import { SentinelGranule } from './../../models';

export enum GranulesActionTypes {
    QUERY = '[Asf Api] Query Api',
    QUERY_ERROR = '[Asf Api] Query failed',

    SET = '[Granuels] Set Granules',
    CLEAR = '[Granuels] Clear Granules',
}

export class QueryApi implements Action {
    public readonly type = GranulesActionTypes.QUERY;

    constructor(public payload: string) {}
}

export class QueryError implements Action {
    public readonly type = GranulesActionTypes.QUERY_ERROR;

    constructor(public payload: string) {}
}

export class SetGranules implements Action {
    public readonly type = GranulesActionTypes.SET;

    constructor(public payload: SentinelGranule[]) {}
}

export class ClearGranules implements Action {
    public readonly type = GranulesActionTypes.CLEAR;
}

export type Actions =
    | QueryApi
    | QueryError
    | SetGranules
    | ClearGranules;

