import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MapActionType, MapActions } from './map.action';
import { MapViewType, LonLat } from '../../models';


export interface MapState {
  view: MapViewType;
  mapCenter: LonLat;
  mapZoom: number;
}

const initState: MapState = {
  view: MapViewType.EQUITORIAL,
  mapCenter: { lon: 0, lat: 0 },
  mapZoom: 3
};


export function mapReducer(state = initState, action: MapActions): MapState {
  switch (action.type) {
    case MapActionType.SET_MAP_VIEW: {
      return {
        ...state,
        view: action.payload
      };
    }

    case MapActionType.UPDATE_MAP_CENTER: {
      return {
        ...state,
        mapCenter: action.payload
      };
    }

    case MapActionType.UPDATE_MAP_ZOOM: {
      return {
        ...state,
        mapZoom: action.payload
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
