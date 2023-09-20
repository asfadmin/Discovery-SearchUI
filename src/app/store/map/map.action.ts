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

  SET_BROWSE_OVERLAYS = '[Map] Set Browse Overlays On Map',
  TOGGLE_BROWSE_OVERLAY = '[Map] Toggle Selected Browse Overlay',
  SET_BROWSE_OVERLAY_OPACITY = '[Map] Set Browse Overlay Opacity',
  SET_COHERENCE_OVERLAY_OPACITY = '[Map] Set Coherence layer opacity',
  CLEAR_BROWSE_OVERLAYS = '[Map] Clear All Browse Overlays On Map',
  DRAW_NEW_POLYGON = '[Map] Set has user drawn new polygon',
  TOGGLE_OVERVIEW_MAP = '[Map] Toggle Overview Map'
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

export class MapInitialized implements Action {
  public readonly type = MapActionType.MAP_INITIALIZED;
}

export class SetBrowseOverlayOpacity implements Action {
  public readonly type = MapActionType.SET_BROWSE_OVERLAY_OPACITY;

  constructor(public payload: number) {}
}

export class SetCoherenceOverlayOpacity implements Action {
  public readonly type = MapActionType.SET_COHERENCE_OVERLAY_OPACITY;

  constructor(public payload: number) {}
}

export class ToggleBrowseOverlay implements Action {
  public readonly type = MapActionType.TOGGLE_BROWSE_OVERLAY;

  constructor(public payload: string) {}
}

export class SetBrowseOverlays implements Action {
  public readonly type = MapActionType.SET_BROWSE_OVERLAYS;

  constructor(public payload: string[]) {}
}

export class ClearBrowseOverlays implements Action {
  public readonly type = MapActionType.CLEAR_BROWSE_OVERLAYS;
}

export class DrawNewPolygon implements Action {
  public readonly type = MapActionType.DRAW_NEW_POLYGON;
}

export class ToggleOverviewMap implements Action {
  public readonly type = MapActionType.TOGGLE_OVERVIEW_MAP;

  constructor(public payload: boolean) {}
}


export type MapActions =
  | SetMapView
  | SetStreetView
  | SetSatelliteView
  | SetMapDrawMode
  | SetMapInteractionMode
  | SetGridlines
  | MapInitialized
  | ToggleBrowseOverlay
  | SetBrowseOverlays
  | SetBrowseOverlayOpacity
  | SetCoherenceOverlayOpacity
  | ClearBrowseOverlays
  | DrawNewPolygon
  | ToggleOverviewMap;
