import { createAction, props } from '@ngrx/store';
import * as models from '@models';

export const showGraphLines = createAction('[Chart] show lines')
export const hideGraphLines = createAction('[Chart] hide lines')
export const reset = createAction('[Chart] reset chart options')
export const setTimeseriesStates = createAction('[Chart] sets the checked timeseries', props<{'items': models.timeseriesChartItemState[]}>())
export const addTimeseriesState = createAction('[Chart] add checked timeseries', props<{'item': models.timeseriesChartItemState}>())
export const setTimeseriesChecked = createAction('[Chart] set single timeseries as checked/unchecked', props<{'wkt': string, 'checked': boolean}>())
export const setAllTimeseriesChecked = createAction('[Chart] set all timeseries as checked/unchecked', props<{'checked': boolean}>())
export const setChartOutOfDate = createAction('[Chart] mark chart as out of date')
export const setChartUpToDate = createAction('[Chart], mark chart as up to date')