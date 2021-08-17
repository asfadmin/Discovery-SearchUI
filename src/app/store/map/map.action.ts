import { Action } from '@ngrx/store';

import * as models from '@models';

export enum MapActionType {
  SET_STREET_VIEW = '[Map] Set Street view',
  SET_SATELLITE_VIEW = '[Map] Set Satellite view',

  SET_MAP_VIEW = '[Map] Set Map View',
  SET_MAP_DRAW_MODE = '[Map] Set Map Draw Mode',
  SET_MAP_INTERACTION_MODE = '[Map] Set Map Interaction Mode',
  SET_MAP_GRID_LINES = '[Map] Set Map Graticule Lines',
  MAP_INITIALIZED = '[Map] Map Initialized',
}

export class SetStreetView implements Action {
  public readonly type = MapActionType.SET_STREET_VIEW;
}

export class SetSatelliteView implements Action {
  public readonly type = MapActionType.SET_SATELLITE_VIEW;
}

export class SetMapView implements Action {
  public readonly type = MapActionType.SET_MAP_VIEW;

  constructor(public payload: models.MapViewType) {}
}

export class SetMapDrawMode implements Action {
  public readonly type = MapActionType.SET_MAP_DRAW_MODE;

  constructor(public payload: models.MapDrawModeType) {}
}

export class SetMapInteractionMode implements Action {
  public readonly type = MapActionType.SET_MAP_INTERACTION_MODE;

  constructor(public payload: models.MapInteractionModeType) {}
}

export class SetGridlines implements Action {
  public readonly type = MapActionType.SET_MAP_GRID_LINES;

  constructor(public payload: boolean) {}
}

export class MapInitialzed implements Action {
  public readonly type = MapActionType.MAP_INITIALIZED;
}


export type MapActions =
  | SetMapView
  | SetStreetView
  | SetSatelliteView
  | SetMapDrawMode
  | SetMapInteractionMode
  | SetGridlines
  | MapInitialzed;
