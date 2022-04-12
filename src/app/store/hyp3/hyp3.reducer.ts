import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Hyp3ActionType, Hyp3Actions } from './hyp3.action';
import {
  Hyp3Job, Hyp3User, Hyp3ProcessingOptions,
  hyp3DefaultJobOptions, OnDemandSubscription
} from '@models';

/* State */

export interface Hyp3State {
  jobs: Hyp3Job[];
  subscriptions: OnDemandSubscription[];
  user: Hyp3User | null;
  isUserLoading: boolean;
  areJobsLoading: boolean;
  areSubscriptionsLoading: boolean;
  submittingJobName: string | null;
  processingOptions: Hyp3ProcessingOptions;
  projectName: string;
}

const initState: Hyp3State = {
  jobs: [],
  subscriptions: [],
  user: null,
  isUserLoading: false,
  areJobsLoading: false,
  areSubscriptionsLoading: false,
  submittingJobName: null,
  processingOptions: hyp3DefaultJobOptions,
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

    case Hyp3ActionType.LOAD_SUBSCRIPTIONS: {
      return {
        ...state,
        areSubscriptionsLoading: true
      };
    }

    case Hyp3ActionType.SET_SUBSCRIPTIONS: {
      return {
        ...state,
        subscriptions: action.payload,
        areSubscriptionsLoading: false
      };
    }

    case Hyp3ActionType.SET_PROCESSING_OPTIONS: {
      return {
        ...state,
        processingOptions: action.payload
      };
    }

    case Hyp3ActionType.CLEAR_PROCESSING_OPTIONS: {
      return {
        ...state,
        processingOptions: hyp3DefaultJobOptions
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

export const getOnDemandSubscriptions = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.subscriptions
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
