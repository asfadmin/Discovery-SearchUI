import { Action } from '@ngrx/store';

import { MissionPlatform } from '@models';

export enum MissionActionType {
  LOAD_MISSIONS = '[Mission] Load Missions',
  SET_MISSIONS = '[Mission] Set Missions',

  SELECT_MISSION = '[Mission] Select Mission',
}

export class LoadMissions implements Action {
  public readonly type = MissionActionType.LOAD_MISSIONS;
}

export class SetMissions implements Action {
  public readonly type = MissionActionType.SET_MISSIONS;

  constructor(public payload: {[platform: string]: string}) {}
}

export class SelectMission implements Action {
  public readonly type = MissionActionType.SELECT_MISSION;

  constructor(public payload: string) {}
}

export type MissionActions =
  | LoadMissions
  | SetMissions
  | SelectMission;
