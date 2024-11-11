import { createReducer, on } from '@ngrx/store';
import * as chartActions from './charts.action';
import * as models from '@models';

export interface ChartsState {
  showLines: boolean;
  seriesStates: { [key: string]: models.timeseriesChartItemState };
  outOfDate: boolean;
}

export const initialState: ChartsState = {
  showLines: true,
  seriesStates: {},
  outOfDate: false
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
      prev[curr.wkt] = { checked: true, color: curr.color, name: curr.name, wkt: curr.wkt, geoemetry: curr.geoemetry }
      return prev
    }, {})
  }
  )),
  on(chartActions.addTimeseriesState, (state, { item }) => {

    const seriesState = { ...state.seriesStates, [item.wkt]: item }
    return { ...state, seriesStates: seriesState }
  }),
  on(chartActions.setAllTimeseriesChecked, (state, { checked }) => {
    const seriesStates = Object.values(state.seriesStates).reduce((prev, curr) => {
      prev[curr.wkt] = { ...curr, checked }
      return prev
    }, {});
    return {...state, seriesStates}
  }),
  on(chartActions.setChartOutOfDate, (state) => ({...state, outOfDate: true})),
  on(chartActions.setChartUpToDate, (state) => ({...state, outOfDate: false})),
  on(chartActions.removeTimeseriesState, (state, {wkt}) => {
    const seriesStates = {...state.seriesStates}
    delete seriesStates[wkt]
    return {...state, seriesStates}
  }),
  on(chartActions.reset, (_) => initialState)
);
