import { Action } from '@ngrx/store';

import { SentinelGranule } from '../../../models/sentinel-granule.model';

export enum GranulesActionTypes {
    LOAD = '[Granules] Load Granules',
    ADD = '[Granuels] Add Granules'
}

export class LoadGranules implements Action {
    public readonly type = GranulesActionTypes.LOAD;
}

export class AddGranules implements Action {
    public readonly type = GranulesActionTypes.ADD;

    constructor(public payload: SentinelGranule[]) {}
}

export type GranulesActions =
    LoadGranules |
    AddGranules;

