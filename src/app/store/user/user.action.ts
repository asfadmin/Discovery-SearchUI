import { Action } from '@ngrx/store';

import { UserAuth } from '@models';

export enum UserActionType {
  SET_USER_AUTH = '[User] Set User Auth'
}

export class SetUserAuth implements Action {
  public readonly type = UserActionType.SET_USER_AUTH;

  constructor(public payload: UserAuth) {}
}

export type UserActions =
  |  SetUserAuth;
