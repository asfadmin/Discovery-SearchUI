import { createReducer, on } from '@ngrx/store';
import * as chartActions from './charts.action';
import * as models from '@models';

export interface ChartsState {
  showLines: boolean;
  showLinearFit: boolean;
  seriesStates: { [key: string]: models.timeseriesChartItemState };
  outOfDate: boolean;
  baseReferenceDate: models.TimeSeriesData;
}


export const initialState: ChartsState = {
  showLines: true,
  showLinearFit: false,
  seriesStates: {},
  outOfDate: false,
  baseReferenceDate: null
};

export const chartsReducer = createReducer(
  initialState,
  on(chartActions.showGraphLines, (state) => ({ ...state, showLines: true })),
  on(chartActions.hideGraphLines, (state) => ({ ...state, showLines: false })),
  on(chartActions.setTimeseriesChecked, (state, { wkt, checked }) => {
    // const output = { ...state };
    // if (wkt in output.seriesStates) {
    // output.seriesStates[wkt].checked = checked;
    // }

    const seriesState = { ...state.seriesStates, [wkt]: { ...state.seriesStates[wkt], checked } }
    return { ...state, seriesStates: seriesState }
    // return output;
  }),
  on(chartActions.setTimeseriesStates, (state, { items }) => ({
    ...state, seriesStates: items.reduce((prev: { [key: string]: models.timeseriesChartItemState }, curr) => {
      prev[curr.wkt] = { checked: true, color: curr.color, seriesNumber: curr.seriesNumber, name: curr.name, wkt: curr.wkt, geometry: curr.geometry, linearFit: curr.linearFit, valid: true }
      return prev
    }, {})
  }
  )),
  on(chartActions.resetTimeseriesStates, (state) => {
    return {...state, seriesStates: {}}
  }),
  on(chartActions.addTimeseriesState, (state, { item }) => {

    const seriesState = { ...state.seriesStates, [item.wkt]: item }
    return { ...state, seriesStates: seriesState }
  }),
  on(chartActions.setAllTimeseriesChecked, (state, { checked }) => {
    const seriesStates = Object.values(state.seriesStates).reduce((prev, curr) => {
      prev[curr.wkt] = { ...curr, checked }
      return prev
    }, {});
    return { ...state, seriesStates }
  }),
  on(chartActions.setChartOutOfDate, (state) => ({ ...state, outOfDate: true })),
  on(chartActions.setChartUpToDate, (state) => ({ ...state, outOfDate: false })),
  on(chartActions.removeTimeseriesState, (state, { wkt }) => {
    const seriesStates = { ...state.seriesStates }
    delete seriesStates[wkt]
    return { ...state, seriesStates }
  }),
  on(chartActions.setTimeseriesColor, (state, { wkt, color }) => {
    const seriesStates = { ...state.seriesStates };
    seriesStates[wkt] = { ...seriesStates[wkt], color };

    return { ...state, seriesStates };
  }),
  on(chartActions.showLinearFit, (state) => {
    return {...state, showLinearFit: true}
  }),
  on(chartActions.hideLinearFit, (state) => {
    return {...state, showLinearFit: false}
  }),
  on(chartActions.setReferenceData, (state, {data}) => {
    return {...state, baseReferenceDate: data}
  }),
  on(chartActions.resetReferenceData, (state) => {
    return {...state, baseReferenceDate: null}
  }),
  on(chartActions.setTimeseriesValid, (state, {wkt, valid}) => {
    const seriesStates = Object.values(state.seriesStates).reduce((prev, curr) => {
      prev[curr.wkt] = { ...curr, valid:  curr.wkt == wkt ? valid : curr.valid}
      return prev
    }, {});
    return { ...state, seriesStates }
  }),
  on(chartActions.reset, (_) => initialState)
);
