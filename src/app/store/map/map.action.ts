import { Action } from '@ngrx/store';

import { MapView } from '../../models';

export enum MapActionType {
  SET_MAP_VIEW = '[Map] Set Map View',
}

export class SetMapView implements Action {
  public readonly type = MapActionType.SET_MAP_VIEW;

  constructor(public payload: MapView) {}
}

export type MapActions =
  | SetMapView;
