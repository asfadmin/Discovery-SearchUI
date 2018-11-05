import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MapActionType, MapActions } from './map.action';
import { MapView } from '../../models';


export interface MapState {
  view: MapView;
}

export const initState: MapState = {
  view: MapView.ARCTIC
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
