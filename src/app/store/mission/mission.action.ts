import { Action } from '@ngrx/store';

import { MissionDataset } from '@models';

export enum MissionActionType {
  LOAD_MISSIONS = '[Mission] Load Missions',
  SET_MISSIONS = '[Mission] Set Missions',

  SELECT_MISSION = '[Mission] Select Mission',
  CLEAR_SELECTED_MISSION = '[Mission] Clear Selected Mission',
}

export class LoadMissions implements Action {
  public readonly type = MissionActionType.LOAD_MISSIONS;
}

export class SetMissions implements Action {
  public readonly type = MissionActionType.SET_MISSIONS;

  constructor(public payload: {[dataset: string]: string}) {}
}

export class SelectMission implements Action {
  public readonly type = MissionActionType.SELECT_MISSION;

  constructor(public payload: string) {}
}

export class ClearSelectedMission implements Action {
  public readonly type = MissionActionType.CLEAR_SELECTED_MISSION;
}

export type MissionActions =
  | LoadMissions
  | SetMissions
  | SelectMission
  | ClearSelectedMission;
