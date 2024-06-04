import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Hyp3ActionType, Hyp3Actions } from './hyp3.action';
import {
  Hyp3Job, Hyp3User, Hyp3ProcessingOptions,
  hyp3DefaultJobOptions, Hyp3CostsByJobType
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
  userId: string;
  costs: Hyp3CostsByJobType;
  debug_status: string;
}

const initState: Hyp3State = {
  jobs: [],
  user: null,
  isUserLoading: false,
  areJobsLoading: false,
  submittingJobName: null,
  processingOptions: hyp3DefaultJobOptions,
  projectName: '',
  debug_status: '',
  userId: '',
  costs: {
    "AUTORIFT": {
      "cost": 1,
      "job_type": "AUTORIFT"
    },
    "INSAR_GAMMA": {
      "cost": 1,
      "job_type": "INSAR_GAMMA"
    },
    "RTC_GAMMA": {
      "cost": 1,
      "job_type": "RTC_GAMMA"
    },
    "INSAR_ISCE_BURST": {
      "cost": 1,
      "job_type": "INSAR_ISCE_BURST"
    }
  }
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


    case Hyp3ActionType.SET_PROCESSING_OPTIONS: {
      const {jobTypeId, options} = action.payload;
      const newOptions = { ...state.processingOptions };
      newOptions[jobTypeId] = options;

      return {
        ...state,
        processingOptions: newOptions
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

    case Hyp3ActionType.SET_ON_DEMAND_USER_ID: {
      return {
        ...state,
        userId: action.payload
      };
    }

    case Hyp3ActionType.LOAD_USER: {
      return {
        ...state,
        isUserLoading: true
      };
    }

    case Hyp3ActionType.SET_COSTS: {
      const byType = action.payload.reduce((byJobType, job) => {

        if (!job.cost_table) {
          byJobType[job.job_type] = job;
        } else {
          const byCostTableValue = job.cost_table.reduce((byValue, costTableValue) => {
            byValue[costTableValue.parameter_value] = costTableValue.cost;

            return byValue;
          }, {});

          byJobType[job.job_type] = {
            ...job,
            cost_table: byCostTableValue,
          };
        }

        return byJobType;
      }, {});

      return {
        ...state,
        costs: byType
      };
    }

    case Hyp3ActionType.SET_DEBUG_STATUS: {
      return {
        ...state,
        debug_status: action.payload
      }
    }

    case Hyp3ActionType.SET_USER: {
      let temp_user = {
        ...action.payload
      }
      if(state.debug_status !== '') {
        temp_user.application_status = state.debug_status
      }
      temp_user.application_status = temp_user.application_status.toUpperCase();
      return {
        ...state,
        user: temp_user,
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

export const getOnDemandUserId = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.userId
);

export const getCosts = createSelector(
  getHyp3State,
  (state: Hyp3State) => state.costs
);
