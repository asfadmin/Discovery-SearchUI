import { createReducer, on } from '@ngrx/store';
import { showGraphLines, hideGraphLines, reset } from './charts.action';

export interface ChartsState {
    showLines: boolean;
}

export const initialState: ChartsState = {
    showLines: true
};

export const chartsReducer = createReducer(
  initialState,
  on(showGraphLines, (state) => ({...state, showLines: true})),
  on(hideGraphLines, (state) => ({...state, showLines: false})),
  on(reset, (_) => initialState)
);
