import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MapActionType, MapActions } from './map.action';
import { MapViewType, LonLat } from '../../models';


export interface MapState {
  view: MapViewType;
}

const initState: MapState = {
  view: MapViewType.EQUITORIAL,
};


export function mapReducer(state = initState, action: MapActions): MapState {
  switch (action.type) {
    case MapActionType.SET_MAP_VIEW: {
      return {
        ...state,
        view: action.payload
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
