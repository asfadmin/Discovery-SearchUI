import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SentinelGranule } from '../../models/sentinel-granule.model';
import { GranulesActionTypes, GranulesActions } from '../actions';

interface GranuleEntities { [id: string]: SentinelGranule; }
export interface GranulesState {
    ids: string[];
    entities: GranuleEntities;

    loading: boolean;
    error: string | undefined;
}

export const initState: GranulesState = {
    ids: [],
    entities: {},

    loading: false,
    error: undefined,
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
                loading: false,

                ids: Object.keys(totalGranules),
                entities: totalGranules
            };
        }

        case GranulesActionTypes.QUERY: {
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        }

        case GranulesActionTypes.QUERY_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload
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

export const getLoading = createSelector(
    getGranulesState,
    (state: GranulesState) => state.loading
);

export const getError = createSelector(
    getGranulesState,
    (state: GranulesState) => state.error
);
