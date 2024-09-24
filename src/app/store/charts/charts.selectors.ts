import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChartsState } from './charts.reducer';


export const getChartsState = createFeatureSelector<ChartsState>('charts');
export const getShowLines = createSelector(
    getChartsState,
    (state: ChartsState) => state.showLines
)