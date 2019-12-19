import { Action } from '@ngrx/store';

import { UserAuth, UserProfile } from '@models';

export enum UserActionType {
  SET_USER_AUTH = '[User] Set User Auth',
  SAVE_PROFILE = '[User] Save User Profile',
  SET_PROFILE = '[User] Set User Profile'
}

export class SetUserAuth implements Action {
  public readonly type = UserActionType.SET_USER_AUTH;

  constructor(public payload: UserAuth) {}
}

export class SaveProfile implements Action {
  public readonly type = UserActionType.SAVE_PROFILE;
}

export class SetProfile implements Action {
  public readonly type = UserActionType.SET_PROFILE;

  constructor(public payload: UserProfile) {}
}

export type UserActions =
  | SaveProfile
  | SetProfile
  | SetUserAuth;
