import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as models from '@models';

import { MapActionType, MapActions } from './map.action';


export interface MapState {
  view: models.MapViewType;
  drawMode: models.MapDrawModeType;
  interactionMode: models.MapInteractionModeType;
  layerType: models.MapLayerTypes;
  gridLinesActive: boolean;
  isMapInitialized: boolean;
  browseOverlayOpacity: number;
  overviewMapOpen: boolean;
}

export const initState: MapState = {
  view: models.MapViewType.EQUITORIAL,
  drawMode: models.MapDrawModeType.BOX,
  interactionMode: models.MapInteractionModeType.DRAW,
  layerType: models.MapLayerTypes.SATELLITE,
  gridLinesActive: false,
  isMapInitialized: false,
  browseOverlayOpacity: 1.0,
  overviewMapOpen: false
};


export function mapReducer(state = initState, action: MapActions): MapState {
  switch (action.type) {
    case MapActionType.SET_MAP_VIEW: {
      return {
        ...state,
        view: action.payload
      };
    }

    case MapActionType.SET_STREET_VIEW: {
      return {
        ...state,
        layerType: models.MapLayerTypes.STREET,
      };
    }

    case MapActionType.SET_SATELLITE_VIEW: {
      return {
        ...state,
        layerType: models.MapLayerTypes.SATELLITE,
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

    case MapActionType.SET_MAP_GRID_LINES: {
      return {
        ...state,
        gridLinesActive: action.payload
      };
    }

    case MapActionType.MAP_INITIALIZED: {
      return {
        ...state,
        isMapInitialized: true,
      };
    }

    case MapActionType.SET_BROWSE_OVERLAY_OPACITY: {
      const browseOverlayOpacity = action.payload < 0
        ? 0 : action.payload > 1.0
        ? 1.0 : action.payload;
      return {
        ...state,
        browseOverlayOpacity
      };
    }

    case MapActionType.TOGGLE_OVERVIEW_MAP: {
      return {
        ...state,
        overviewMapOpen: action.payload
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

export const getMapLayerType = createSelector(
  getMapState,
  (state: MapState) => state.layerType
);

export const getMapDrawMode = createSelector(
  getMapState,
  (state: MapState) => state.drawMode
);

export const getMapInteractionMode = createSelector(
  getMapState,
  (state: MapState) => state.interactionMode
);

export const getAreGridlinesActive = createSelector(
  getMapState,
  (state: MapState) => state.gridLinesActive
);

export const getIsMapInitialization = createSelector(
  getMapState,
  (state: MapState) => state.isMapInitialized
);

export const getIsOverviewMapOpen = createSelector(
  getMapState,
  (state: MapState) => state.overviewMapOpen
);

export const getBrowseOverlayOpacity = createSelector(
  getMapState,
  (state: MapState) => state.browseOverlayOpacity
);
