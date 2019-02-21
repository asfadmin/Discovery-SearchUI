import { Action } from '@ngrx/store';

import * as models from '@models';

export enum MapActionType {
  SET_MAP_VIEW = '[Map] Set Map View',
  SET_MAP_DRAW_MODE = '[Map] Set Map Draw Mode',
  SET_MAP_INTERACTION_MODE = '[Map] Set Map Interaction Mode',

  MAP_INITIALIZED = '[Map] Map Initialized',
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

export class MapInitialzed implements Action {
  public readonly type = MapActionType.MAP_INITIALIZED;
}

export type MapActions =
  | SetMapView
  | SetMapDrawMode
  | SetMapInteractionMode
  | MapInitialzed;
