import { Action } from '@ngrx/store';

export enum BaselineActionType {
  SET_MASTER = '[Baseline] Set Master'
}

export class SetMaster implements Action {
  public readonly type = BaselineActionType.SET_MASTER;

  constructor(public payload: string) {}
}

export type BaselineActions =
  |  SetMaster;
