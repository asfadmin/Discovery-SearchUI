import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ChartsState } from './charts.reducer';

export const getChartsState = createFeatureSelector<ChartsState>('charts');
export const getShowLines = createSelector(
  getChartsState,
  (state: ChartsState) => state.showLines,
);
export const getShowLinearFit = createSelector(
  getChartsState,
  (state: ChartsState) => state.showLinearFit,
);

export const getTimeseriesChartStates = createSelector(
  getChartsState,
  (state: ChartsState) => state.seriesStates,
);

export const getCheckedTimeseries = createSelector(
  getTimeseriesChartStates,
  (chartStates) => {
    const output = {};
    for (const key of Object.keys(chartStates)) {
      if (chartStates[key].checked) {
        output[key] = chartStates[key];
      }
    }

    return output;
  },
);

export const getAreAllTimeseriesChecked = createSelector(
  getTimeseriesChartStates,
  getCheckedTimeseries,
  (checked, all) => {
    return Object.keys(checked).length === Object.keys(all).length;
  },
);

export const getTimeseriesReference = createSelector(
  getChartsState,
  (state: ChartsState) => state.baseReferenceDate,
);

export const getIsChartOutOfDate = createSelector(
  getChartsState,
  (state) => state.outOfDate,
);

export const getChartWKTs = createSelector(
  getTimeseriesChartStates,
  (chartStates) => Object.keys(chartStates),
);

export const getMinSeriesNumber = createSelector(
  getTimeseriesChartStates,
  (seriesStates) => {
    const taken = new Set(
      Object.values(seriesStates).map((state) => +state.seriesNumber),
    );

    let output = 1;
    while (taken.has(output)) {
      output++;
    }
    return output;
  },
);
