import { createAction, props } from '@ngrx/store';

import * as models from '@models';

export const showGraphLines = createAction('[Chart] show lines');
export const hideGraphLines = createAction('[Chart] hide lines');
export const reset = createAction('[Chart] reset chart options');
export const setTimeseriesStates = createAction(
  '[Chart] sets the checked timeseries',
  props<{ items: models.timeseriesChartItemState[] }>(),
);
export const resetTimeseriesStates = createAction(
  '[Chart] Reset timeseries states',
);
export const addTimeseriesState = createAction(
  '[Chart] add checked timeseries',
  props<{ item: models.timeseriesChartItemState }>(),
);
export const removeTimeseriesState = createAction(
  '[Chart] removes timeseries by wkt',
  props<{ uuid: string }>(),
);
export const setTimeseriesChecked = createAction(
  '[Chart] set single timeseries as checked/unchecked',
  props<{ uuid: string; checked: boolean }>(),
);
export const setAllTimeseriesChecked = createAction(
  '[Chart] set all timeseries as checked/unchecked',
  props<{ checked: boolean }>(),
);
export const setTimeseriesColor = createAction(
  '[Chart] set the color of a single timeseries',
  props<{ uuid: string; color: string }>(),
);
export const setTimeseriesValid = createAction(
  '[Chart] mark a timeseries aoi as invalid',
  props<{ uuid: string; valid: boolean; error?: any }>(),
);
export const setChartOutOfDate = createAction(
  '[Chart] mark chart as out of date',
);
export const setChartUpToDate = createAction(
  '[Chart], mark chart as up to date',
);
export const showLinearFit = createAction('[Chart] show all linear fit lines');
export const hideLinearFit = createAction('[Chart] hide all linear fit lines');
export const setReferenceData = createAction(
  '[Chart] set reference point data',
  props<{ data: models.TimeSeriesData }>(),
);
export const resetReferenceData = createAction(
  '[Chart] Reset chart reference point data',
);
export const setFrames = createAction(
  '[Chart] Set a series frame pieces',
  props<{ uuid: string; frames: models.TimeseriesSubframe[] }>(),
);
