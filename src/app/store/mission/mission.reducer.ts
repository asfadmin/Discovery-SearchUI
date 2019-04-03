import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MissionActionType, MissionActions } from './mission.action';

/* State */

export interface MissionState {
  missions: {[platform: string]: string};
  selectedMission: null | string;
}

export const initState: MissionState = {
  missions: {},
  selectedMission:  null,
};

/* Reducer */

export function missionReducer(state = initState, action: MissionActions): MissionState {
  switch (action.type) {
    case MissionActionType.SET_MISSIONS: {
      return {
        ...state,
        missions: action.payload
      };
    }

    case MissionActionType.SELECT_MISSION: {
      return {
        ...state,
        selectedMission: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

/* Selectors */

export const getMissionState = createFeatureSelector<MissionState>('mission');

export const getMissionsByPlatform = createSelector(
  getMissionState,
  (state: MissionState) => state.missions
);

export const getSelectedMission = createSelector(
  getMissionState,
  (state: MissionState) => state.selectedMission
);
