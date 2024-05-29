import { Action } from '@ngrx/store';

import { Hyp3Job, Hyp3User, Hyp3ProcessingOptions, Hyp3Costs } from '@models';

export enum Hyp3ActionType {
  LOAD_JOBS = '[Hyp3] Load Jobs',
  SET_JOBS = '[Hyp3] Set Jobs',

  SET_PROCESSING_OPTIONS = '[Hyp3] Set Processing Options',
  SET_PROCESSING_PROJECT_NAME = '[Hyp3] Set Processing Project Name',

  SET_ON_DEMAND_USER_ID = '[Hyp3] Set On Demand User ID',

  LOAD_USER = '[Hyp3] Load User',
  SET_USER = '[Hyp3] Set User',
  ERROR_LOADING_USER = '[Hyp3] Error Loading User',
  LOAD_COSTS = '[Hyp3] Load Costs',
  SET_COSTS = '[Hyp3] Set Costs',

  SUBMIT_JOB = '[Hyp3] Submit Job',
  SUCCESSFUL_JOB_SUBMISSION = '[Hyp3] Successful Job Submission',
  ERROR_JOB_SUBMISSION = '[Hyp3] Error Job Submission',

  CLEAR_PROCESSING_OPTIONS = '[Hyp3] Clear Processing Options',
  SET_DEBUG_STATUS = '[Hyp3] Set debug status',

}

export class LoadJobs implements Action {
  public readonly type = Hyp3ActionType.LOAD_JOBS;
}

export class SetJobs implements Action {
  public readonly type = Hyp3ActionType.SET_JOBS;

  constructor(public payload: Hyp3Job[]) {}
}

export class SetProcessingOptions implements Action {
  public readonly type = Hyp3ActionType.SET_PROCESSING_OPTIONS;

  constructor(public payload: {jobTypeId: string; options: Hyp3ProcessingOptions}) {}
}

export class ClearProcessingOptions implements Action {
  public readonly type = Hyp3ActionType.CLEAR_PROCESSING_OPTIONS;
}
export class SetProcessingProjectName implements Action {
  public readonly type = Hyp3ActionType.SET_PROCESSING_PROJECT_NAME;

  constructor(public payload: string) {}
}

export class SetOnDemandUserID implements Action {
  public readonly type = Hyp3ActionType.SET_ON_DEMAND_USER_ID;

  constructor(public payload: string) {}
}

export class SubmitJob implements Action {
  public readonly type = Hyp3ActionType.SUBMIT_JOB;

  constructor(public payload: string) {}
}

export class SuccessfulJobSubmission implements Action {
  public readonly type = Hyp3ActionType.SUCCESSFUL_JOB_SUBMISSION;
}

export class ErrorJobSubmission implements Action {
  public readonly type = Hyp3ActionType.ERROR_JOB_SUBMISSION;
}

export class LoadUser implements Action {
  public readonly type = Hyp3ActionType.LOAD_USER;
}
export class SetDebugStatus implements Action {
  public readonly type = Hyp3ActionType.SET_DEBUG_STATUS;

  constructor(public payload: string) {}
}
export class SetUser implements Action {
  public readonly type = Hyp3ActionType.SET_USER;

  constructor(public payload: Hyp3User) {}
}

export class LoadCosts implements Action {
  public readonly type = Hyp3ActionType.LOAD_COSTS;
}

export class SetCosts implements Action {
  public readonly type = Hyp3ActionType.SET_COSTS;

  constructor(public payload: Hyp3Costs) {}
}

export class ErrorLoadingUser implements Action {
  public readonly type = Hyp3ActionType.ERROR_LOADING_USER;
}

export type Hyp3Actions =
  | LoadJobs
  | SetJobs
  | LoadUser
  | SetUser
  | LoadCosts
  | SetCosts
  | ErrorLoadingUser
  | SetProcessingOptions
  | ClearProcessingOptions
  | SetProcessingProjectName
  | SetOnDemandUserID
  | SubmitJob
  | SuccessfulJobSubmission
  | ErrorJobSubmission
  | SetDebugStatus;
