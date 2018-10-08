import { Action } from '@ngrx/store';

import { SentinelGranule } from './../../models/sentinel-granule.model';

export enum GranulesActionTypes {
    QUERY = '[Asf Api] Query Api',
    QUERY_ERROR = '[Asf Api] Query failed',

    ADD = '[Granuels] Add Granules',
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

export class AddGranules implements Action {
    public readonly type = GranulesActionTypes.ADD;

    constructor(public payload: SentinelGranule[]) {}
}

export class ClearGranules implements Action {
    public readonly type = GranulesActionTypes.CLEAR;
}

export type Actions =
    | QueryApi
    | QueryError
    | AddGranules
    | ClearGranules;

