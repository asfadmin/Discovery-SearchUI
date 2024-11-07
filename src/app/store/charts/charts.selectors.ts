import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChartsState } from './charts.reducer';


export const getChartsState = createFeatureSelector<ChartsState>('charts');
export const getShowLines = createSelector(
    getChartsState,
    (state: ChartsState) => state.showLines
);

export const getTimeseriesChartStates = createSelector(
    getChartsState,
    (state: ChartsState) => state.seriesStates
);

export const getCheckedTimeseries = createSelector(
    getTimeseriesChartStates,
    (chartStates) => {
        const output = {};
        for (const key in Object.keys(chartStates)) {
            if (chartStates[key].checked) {
                output[key] = chartStates[key];
            }
        }

        return output;
    }
);

export const getAreAllTimeseriesChecked = createSelector(
    getTimeseriesChartStates,
    getTimeseriesChartStates,
    (checked, all) => {
        return Object.keys(checked).length === Object.keys(all).length 
    }
)

export const getIsChartOutOfDate = createSelector(
    getChartsState,
    (state) => state.outOfDate
)