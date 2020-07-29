import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Hyp3ActionType, Hyp3Actions } from './hyp3.action';
import { Hyp3Job } from '@models';

/* State */

export interface Hyp3State {
  jobs: Hyp3Job[];
  areJobsLoading: boolean;
  submittingJobName: string | null;
}

const initState: Hyp3State = {
  jobs: [],
  areJobsLoading: false,
  submittingJobName: null,
};

/* Reducer */

export function hyp3Reducer(state = initState, action: Hyp3Actions): Hyp3State {
  switch (action.type) {
    case Hyp3ActionType.LOAD_JOBS: {
      return {
        ...state,
        areJobsLoading: true
      };
    }

    case Hyp3ActionType.SET_JOBS: {
      return {
        ...state,
        jobs: action.payload,
        areJobsLoading: false
      };
    }

    case Hyp3ActionType.CLEAR_JOBS: {
      return {
        ...state,
        jobs: [],
      };
    }

    case Hyp3ActionType.SUBMIT_JOB: {
      return {
        ...state,
        submittingJobName: action.payload,
      };
    }

    case Hyp3ActionType.SUCCESSFUL_JOB_SUBMISSION: {
      return {
        ...state,
        submittingJobName: null,
      };
    }

    case Hyp3ActionType.ERROR_JOB_SUBMISSION: {
      return {
        ...state,
        submittingJobName: null,
      };
    }

    default: {
      return state;
    }
  }
}

/* Selectors */

export const getHyp3State = createFeatureSelector<Hyp3State>('hyp3');

export const getHyp3Jobs = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.jobs
);

export const getAreHyp3JobsLoading = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.areJobsLoading
);

export const getSubmittingJobName = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.submittingJobName
);

