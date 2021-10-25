import { Action } from '@ngrx/store';

import { Hyp3Job, Hyp3User, Hyp3ProcessingOptions, OnDemandSubscription } from '@models';

export enum Hyp3ActionType {
  LOAD_JOBS = '[Hyp3] Load Jobs',
  SET_JOBS = '[Hyp3] Set Jobs',

  LOAD_SUBSCRIPTIONS = '[Hyp3] Load Subscriptions',
  SET_SUBSCRIPTIONS = '[Hyp3] Set Subscriptions',

  SET_PROCESSING_OPTIONS = '[Hyp3] Set Processing Options',
  SET_PROCESSING_PROJECT_NAME = '[Hyp3] Set Processing Project Name',

  LOAD_USER = '[Hyp3] Load User',
  SET_USER = '[Hyp3] Set User',
  ERROR_LOADING_USER = '[Hyp3] Error Loading User',

  SUBMIT_JOB = '[Hyp3] Submit Job',
  SUCCESSFUL_JOB_SUBMISSION = '[Hyp3] Successful Job Submission',
  ERROR_JOB_SUBMISSION = '[Hyp3] Error Job Submission',

  CLEAR_PROCESSING_OPTIONS = '[Hyp3] Clear Processing Options',
}

export class LoadJobs implements Action {
  public readonly type = Hyp3ActionType.LOAD_JOBS;
}

export class SetJobs implements Action {
  public readonly type = Hyp3ActionType.SET_JOBS;

  constructor(public payload: Hyp3Job[]) {}
}

export class LoadSubscriptions implements Action {
  public readonly type = Hyp3ActionType.LOAD_SUBSCRIPTIONS;
}

export class SetSubscriptions implements Action {
  public readonly type = Hyp3ActionType.SET_SUBSCRIPTIONS;

  constructor(public payload: OnDemandSubscription[]) {}
}

export class SetProcessingOptions implements Action {
  public readonly type = Hyp3ActionType.SET_PROCESSING_OPTIONS;

  constructor(public payload: Hyp3ProcessingOptions) {}
}

export class ClearProcessingOptions implements Action {
  public readonly type = Hyp3ActionType.CLEAR_PROCESSING_OPTIONS;
}
export class SetProcessingProjectName implements Action {
  public readonly type = Hyp3ActionType.SET_PROCESSING_PROJECT_NAME;

  constructor(public payload: string) {}
}

export class SubmitJob implements Action {
  public readonly type = Hyp3ActionType.SUBMIT_JOB;

  constructor(public payload: string) {}
}

export class SuccessfulJobSumbission implements Action {
  public readonly type = Hyp3ActionType.SUCCESSFUL_JOB_SUBMISSION;
}

export class ErrorJobSubmission implements Action {
  public readonly type = Hyp3ActionType.ERROR_JOB_SUBMISSION;
}

export class LoadUser implements Action {
  public readonly type = Hyp3ActionType.LOAD_USER;
}

export class SetUser implements Action {
  public readonly type = Hyp3ActionType.SET_USER;

  constructor(public payload: Hyp3User) {}
}

export class ErrorLoadingUser implements Action {
  public readonly type = Hyp3ActionType.ERROR_LOADING_USER;
}

export type Hyp3Actions =
  | LoadJobs
  | SetJobs
  | LoadSubscriptions
  | SetSubscriptions
  | LoadUser
  | SetUser
  | ErrorLoadingUser
  | SetProcessingOptions
  | ClearProcessingOptions
  | SetProcessingProjectName
  | SubmitJob
  | SuccessfulJobSumbission
  | ErrorJobSubmission;
