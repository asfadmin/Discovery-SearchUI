import { Action } from '@ngrx/store';

import { MissionPlatform } from '@models';

export enum MissionActionType {
  LOAD_MISSIONS = '[Mission] Load missions',
  SET_MISSIONS = '[Mission] Set missions',
}

export class LoadMissions implements Action {
  public readonly type = MissionActionType.LOAD_MISSIONS;
}

export class SetMissions implements Action {
  public readonly type = MissionActionType.SET_MISSIONS;

  constructor(public payload: {[platform: string]: string}) {}
}

export type MissionActions =
  |  LoadMissions
  |  SetMissions;
