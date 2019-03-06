import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as models from '@models';

import { MapActionType, MapActions } from './map.action';


export interface MapState {
  view: models.MapViewType;
  drawMode: models.MapDrawModeType;
  interactionMode: models.MapInteractionModeType;
  isMapInitialized: boolean;
}

const initState: MapState = {
  view: models.MapViewType.EQUITORIAL,
  drawMode: models.MapDrawModeType.POLYGON,
  interactionMode: models.MapInteractionModeType.DRAW,
  isMapInitialized: false,
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

    case MapActionType.MAP_INITIALIZED: {
      return {
        ...state,
        isMapInitialized: true,
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

export const getIsMapInitialization = createSelector(
  getMapState,
  (state: MapState) => state.isMapInitialized
);
