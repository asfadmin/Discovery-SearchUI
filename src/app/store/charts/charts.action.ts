import { createAction } from '@ngrx/store';

export const showGraphLines = createAction('[Chart] show lines')
export const hideGraphLines = createAction('[Chart] hide lines')
export const reset = createAction('[Chart] reset chart options')