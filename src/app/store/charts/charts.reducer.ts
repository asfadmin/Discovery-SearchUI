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
  showLines: false,
  showLinearFit: false,
  seriesStates: {},
  outOfDate: false,
  baseReferenceDate: null
};

export const chartsReducer = createReducer(
  initialState,
  on(chartActions.showGraphLines, (state) => ({ ...state, showLines: true })),
  on(chartActions.hideGraphLines, (state) => ({ ...state, showLines: false })),
  on(chartActions.setTimeseriesChecked, (state, { uuid, checked }) => {
    // const output = { ...state };
    // if (wkt in output.seriesStates) {
    // output.seriesStates[wkt].checked = checked;
    // }

    const seriesState = { ...state.seriesStates, [uuid]: { ...state.seriesStates[uuid], checked } }
    return { ...state, seriesStates: seriesState }
    // return output;
  }),
  on(chartActions.setTimeseriesStates, (state, { items }) => ({
    ...state, seriesStates: items.reduce((prev: { [key: string]: models.timeseriesChartItemState }, curr) => {
      prev[curr.uuidSeries] = { uuidSeries: curr.uuidSeries, checked: true, color: curr.color,
        seriesNumber: curr.seriesNumber, seriesName: curr.seriesName, wkt: curr.wkt,
        geometry: curr.geometry, linearFit: curr.linearFit, drawMode: curr.drawMode }
      return prev
    }, {})
  }
  )),
  on(chartActions.resetTimeseriesStates, (state) => {
    return {...state, seriesStates: {}}
  }),
  on(chartActions.addTimeseriesState, (state, { item }) => {
    const seriesState = { ...state.seriesStates, [item.uuidSeries]: item }
    return { ...state, seriesStates: seriesState }
  }),
  on(chartActions.setAllTimeseriesChecked, (state, { checked }) => {
    const seriesStates = Object.values(state.seriesStates).reduce((prev, curr) => {
      prev[curr.uuidSeries] = { ...curr, checked }
      return prev
    }, {});
    return { ...state, seriesStates }
  }),
  on(chartActions.setChartOutOfDate, (state) => ({ ...state, outOfDate: true })),
  on(chartActions.setChartUpToDate, (state) => ({ ...state, outOfDate: false })),
  on(chartActions.removeTimeseriesState, (state, { uuid }) => {
    const seriesStates = { ...state.seriesStates }
    delete seriesStates[uuid]
    return { ...state, seriesStates }
  }),
  on(chartActions.setTimeseriesColor, (state, { uuid, color }) => {
    const seriesStates = { ...state.seriesStates };
    seriesStates[uuid] = { ...seriesStates[uuid], color };

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
  on(chartActions.setTimeseriesValid, (state, {uuid, valid, error}) => {
    const seriesStates = Object.values(state.seriesStates).reduce((prev, curr) => {
      let index = curr.frames.findIndex(frame => {
        return frame.uuid === uuid;
      });
      if(index > -1) {
        let frames = [...curr.frames]
        frames.splice(index, 1, {...curr.frames[index], valid: valid, error: error})
        prev[curr.uuidSeries] = {...curr, frames }
      } else {
        prev[curr.uuidSeries] = {...curr}
      }
      return prev
    }, {});
    return { ...state, seriesStates }
  }),
  on(chartActions.setFrames, (state, { uuid, frames }) => {
    const seriesStates = { ...state.seriesStates };
    seriesStates[uuid] = { ...seriesStates[uuid], frames };

    return { ...state, seriesStates };
  }),
  on(chartActions.reset, (_) => initialState)
);
