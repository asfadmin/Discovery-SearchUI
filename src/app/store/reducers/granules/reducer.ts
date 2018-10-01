import { SentinelGranule } from '../../../models/sentinel-granule.model';

import { GranulesActionTypes, GranulesActions } from './action';

export interface GranulesState {
    granules: SentinelGranule[];
}

export const initState: GranulesState = {
    granules: []
};


export function granulesReducer(state = initState, action: GranulesActions): GranulesState {
    switch (action.type) {
        case GranulesActionTypes.ADD: {
            return {
                ...state,
                granules: [...state.granules, ...action.payload]
            };
        }

        default: {
            return state;
        }
    }
}

