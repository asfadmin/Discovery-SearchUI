import { Action } from '@ngrx/store';

export enum BaselineActionType {
  SET_MASTER = '[Baseline] Set Master',
  CLEAR_BASELINE = '[Baseline] Clear Baseline',
}

export class SetMaster implements Action {
  public readonly type = BaselineActionType.SET_MASTER;

  constructor(public payload: string) {}
}

export class ClearBaseline implements Action {
  public readonly type = BaselineActionType.CLEAR_BASELINE;
}

export type BaselineActions =
  | ClearBaseline
  | SetMaster;
