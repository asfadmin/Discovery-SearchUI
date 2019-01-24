import { Action } from '@ngrx/store';

import { MapViewType, MapDrawModeType, LonLat } from '@models';

export enum MapActionType {
  SET_MAP_VIEW = '[Map] Set Map View',
  SET_MAP_DRAW_MODE = '[Map] Set Map Draw Mode',
}

export class SetMapView implements Action {
  public readonly type = MapActionType.SET_MAP_VIEW;

  constructor(public payload: MapViewType) {}
}

export class SetMapDrawMode implements Action {
  public readonly type = MapActionType.SET_MAP_DRAW_MODE;

  constructor(public payload: MapDrawModeType) {}
}


export type MapActions =
  | SetMapView
  | SetMapDrawMode;
