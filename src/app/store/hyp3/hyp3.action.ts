import { Action } from '@ngrx/store';

import { Hyp3Job, Hyp3User } from '@models';

export enum Hyp3ActionType {
  LOAD_JOBS = '[Hyp3] Load Jobs',
  SET_JOBS = '[Hyp3] Set Jobs',
  ERROR_LOADING_JOBS = '[Hyp3] Error Loading Jobs',

  LOAD_USER = '[Hyp3] Load User',
  SET_USER = '[Hyp3] Set User',
  ERROR_LOADING_USER = '[Hyp3] Error Loading User',

  SUBMIT_JOB = '[Hyp3] Submit Job',
  SUCCESSFUL_JOB_SUBMISSION = '[Hyp3] Successful Job Submission',
  ERROR_JOB_SUBMISSION = '[Hyp3] Error Job Submission',

  CLEAR_JOBS = '[Hyp3] Clear Jobs',
}

export class LoadJobs implements Action {
  public readonly type = Hyp3ActionType.LOAD_JOBS;
}

export class SetJobs implements Action {
  public readonly type = Hyp3ActionType.SET_JOBS;

  constructor(public payload: Hyp3Job[]) {}
}

export class ErrorLoadingJobs implements Action {
  public readonly type = Hyp3ActionType.ERROR_LOADING_JOBS;
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

export class ClearJobs implements Action {
  public readonly type = Hyp3ActionType.CLEAR_JOBS;
}

export type Hyp3Actions =
  | LoadJobs
  | SetJobs
  | ErrorLoadingJobs
  | LoadUser
  | SetUser
  | ErrorLoadingUser
  | ClearJobs
  | SubmitJob
  | SuccessfulJobSumbission
  | ErrorJobSubmission;
