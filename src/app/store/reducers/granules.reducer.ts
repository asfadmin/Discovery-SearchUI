import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SentinelGranule } from '../../models/sentinel-granule.model';
import { GranulesActionTypes, GranulesActions } from '../actions';

interface GranuleEntities { [id: string]: SentinelGranule; }
export interface GranulesState {
    ids: string[];
    entities: GranuleEntities;
}

export const initState: GranulesState = {
    ids: [],
    entities: {}
};


export function granulesReducer(state = initState, action: GranulesActions.Actions): GranulesState {
    switch (action.type) {
        case GranulesActionTypes.ADD: {
            const totalGranules: GranuleEntities = { ...state.entities };

            for (const g of action.payload) {
                totalGranules[g.name] = g;
            }

            return {
                ...state,
                ids: Object.keys(totalGranules),
                entities: totalGranules
            };
        }

        case GranulesActionTypes.CLEAR: {
            return initState;
        }

        default: {
            return state;
        }
    }
}


export const getGranulesState = createFeatureSelector<GranulesState>('granules');

export const getGranules = createSelector(
    getGranulesState,
    (state: GranulesState) => state.ids.map(id => state.entities[id])
);
