import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MapActionType, MapActions } from './map.action';
import { MapViewType } from '../../models';


export interface MapState {
  view: MapViewType;
}

const initState: MapState = {
  view: MapViewType.EQUITORIAL
};


export function mapReducer(state = initState, action: MapActions): MapState {
  switch (action.type) {
    case MapActionType.SET_EQUITORIAL_VIEW: {
      return {
        ...state,
        view: MapViewType.EQUITORIAL
      };
    }
    case MapActionType.SET_ANTARCTIC_VIEW: {

      return {
        ...state,
        view: MapViewType.ANTARCTIC
      };
    }
    case MapActionType.SET_ARCTIC_VIEW: {
      return {
        ...state,
        view: MapViewType.ARCTIC
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
