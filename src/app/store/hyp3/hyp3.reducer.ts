import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Hyp3ActionType, Hyp3Actions } from './hyp3.action';
import {
  Hyp3Job, Hyp3User, Hyp3ProcessingOptions,
  RtcGammaRadiometry, RtcGammaScale, InSarGammaLooks
} from '@models';

/* State */

export interface Hyp3State {
  jobs: Hyp3Job[];
  user: Hyp3User | null;
  isUserLoading: boolean;
  areJobsLoading: boolean;
  submittingJobName: string | null;
  processingOptions: Hyp3ProcessingOptions;
  projectName: string;
}

const initState: Hyp3State = {
  jobs: [],
  user: null,
  isUserLoading: false,
  areJobsLoading: false,
  submittingJobName: null,
  processingOptions: {
    radiometry: RtcGammaRadiometry.GAMMA0,
    scale: RtcGammaScale.POWER,
    demMatching: false,
    includeDem: false,
    includeIncMap: false,
    speckleFilter: false,

    includeLookVectors: false,
    includeLosDisplacement: false,
    looks: InSarGammaLooks._20x4,
  },
  projectName: '',
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

    case Hyp3ActionType.ERROR_LOADING_JOBS: {
      return {
        ...state,
        areJobsLoading: false
      };
    }

    case Hyp3ActionType.SET_PROCESSING_OPTIONS: {
      return {
        ...state,
        processingOptions: action.payload
      };
    }

    case Hyp3ActionType.SET_PROCESSING_PROJECT_NAME: {
      return {
        ...state,
        projectName: action.payload
      };
    }

    case Hyp3ActionType.LOAD_USER: {
      return {
        ...state,
        isUserLoading: true
      };
    }

    case Hyp3ActionType.SET_USER: {
      return {
        ...state,
        user: action.payload,
        isUserLoading: false
      };
    }

    case Hyp3ActionType.ERROR_LOADING_USER: {
      return {
        ...state,
        isUserLoading: false
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
      }; }

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

export const getHyp3User = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.user
);

export const getIsHyp3UserLoading = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.isUserLoading
);

export const getProcessingOptions = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.processingOptions
);

export const getProcessingProjectName = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.projectName
);
