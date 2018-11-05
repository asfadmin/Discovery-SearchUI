import { Action } from '@ngrx/store';

export enum MapActionType {
  SET_ARCTIC_VIEW = '[Map] Set Arctic Map View',
  SET_EQUITORIAL_VIEW = '[Map] Set Equitorial Map View',
  SET_ANTARCTIC_VIEW = '[Map] Set Antarctic Map View ',
}

export class SetAntarcticView implements Action {
  public readonly type = MapActionType.SET_ANTARCTIC_VIEW;
}

export class SetArcticView implements Action {
  public readonly type = MapActionType.SET_ARCTIC_VIEW;
}

export class SetEquitorialView implements Action {
  public readonly type = MapActionType.SET_EQUITORIAL_VIEW;
}

export type MapActions =
  | SetArcticView
  | SetEquitorialView
  | SetAntarcticView;
