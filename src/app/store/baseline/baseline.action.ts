import { Action } from '@ngrx/store';

export enum BaselineActionType {
  SET_MASTER = '[Baseline] Set Master',
  SET_FILTER_MASTER = '[Baseline] Set Filter Master',
  CLEAR_BASELINE = '[Baseline] Clear Baseline',
}

export class SetMaster implements Action {
  public readonly type = BaselineActionType.SET_MASTER;

  constructor(public payload: string) {}
}

export class SetFilterMaster implements Action {
  public readonly type = BaselineActionType.SET_FILTER_MASTER;

  constructor(public payload: string) {}
}


export class ClearBaseline implements Action {
  public readonly type = BaselineActionType.CLEAR_BASELINE;
}

export type BaselineActions =
  | ClearBaseline
  | SetFilterMaster
  | SetMaster;
