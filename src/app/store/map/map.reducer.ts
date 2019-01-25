import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MapActionType, MapActions } from './map.action';
import { MapViewType, LonLat, MapDrawModeType, MapInteractionModeType  } from '@models';


export interface MapState {
  view: MapViewType;
  drawMode: MapDrawModeType;
  interactionMode: MapInteractionModeType;
}

const initState: MapState = {
  view: MapViewType.EQUITORIAL,
  drawMode: MapDrawModeType.POLYGON,
  interactionMode: MapInteractionModeType.DRAW
};


export function mapReducer(state = initState, action: MapActions): MapState {
  switch (action.type) {
    case MapActionType.SET_MAP_VIEW: {
      return {
        ...state,
        view: action.payload
      };
    }

    case MapActionType.SET_MAP_DRAW_MODE: {
      return {
        ...state,
        drawMode: action.payload
      };
    }

    case MapActionType.SET_MAP_INTERACTION_MODE: {
      return {
        ...state,
        interactionMode: action.payload
      };
    }

    default: {
      return state;
    }
  }
}


export const getMapState = createFeatureSelector<MapState>('map');

export const getMapView = createSelector(
  getMapState,
  (state: MapState) => state.view
);

export const getMapDrawMode = createSelector(
  getMapState,
  (state: MapState) => state.drawMode
);

export const getMapInteractionMode = createSelector(
  getMapState,
  (state: MapState) => state.interactionMode
);
