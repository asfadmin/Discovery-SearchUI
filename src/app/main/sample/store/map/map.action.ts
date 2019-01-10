import { Action } from '@ngrx/store';

import { MapViewType, LonLat } from '../../models';

export enum MapActionType {
  SET_MAP_VIEW = '[Map] Set Map View',
  SET_MAP_CENTER = '[Map] Set Map Center',
  SET_MAP_ZOOM = '[Map] Set Map Zoom',

  UPDATE_MAP_CENTER = '[Map] Update Map Center',
  UPDATE_MAP_ZOOM = '[Map] Update Map Zoom',
}

export class SetMapView implements Action {
  public readonly type = MapActionType.SET_MAP_VIEW;

  constructor(public payload: MapViewType) {}
}

export class UpdateMapCenter implements Action {
  public readonly type = MapActionType.UPDATE_MAP_CENTER;

  constructor(public payload: LonLat) {}
}

export class UpdateMapZoom implements Action {
  public readonly type = MapActionType.UPDATE_MAP_ZOOM;

  constructor(public payload: number) {}
}


export class SetMapCenter implements Action {
  public readonly type = MapActionType.SET_MAP_CENTER;

  constructor(public payload: LonLat) {}
}

export class SetMapZoom implements Action {
  public readonly type = MapActionType.SET_MAP_ZOOM;

  constructor(public payload: number) {}
}

export type MapActions =
  | SetMapView
  | SetMapCenter
  | SetMapZoom
  | UpdateMapCenter
  | UpdateMapZoom;
