import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MapActions } from './map.action';

export enum MapView {
  ARCTIC = 'arctic',
  EQUITORIAL = 'equitorial',
  ANTARCTIC = 'antarctic',
}

export interface MapState {
  view: MapView;
}

export const initState: MapState = {
  view: MapView.EQUITORIAL
};


export function mapReducer(state = initState, action: MapActions): MapState {
  switch (action.type) {
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
