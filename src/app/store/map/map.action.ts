import { Action } from '@ngrx/store';

export enum GranulesActionType {
  SET_ERQUITORIAL_VIEW = '[Map] Set Equitorial Map View',
  SET_ARCTIC_VIEW = '[Map] Set Arctic Map View',
  SET_ANTARCTIC_VIEW = '[Map] Set Antarctic map view',
}

export class SetEquitorialView implements Action {
  public readonly type = GranulesActionType.SET_ERQUITORIAL_VIEW;
}

export class SetArcticView implements Action {
  public readonly type = GranulesActionType.SET_ARCTIC_VIEW;
}

export class SetAntarcticView implements Action {
  public readonly type = GranulesActionType.SET_ANTARCTIC_VIEW;
}

export type MapActions =
  | SetAntarcticView
  | SetEquitorialView
  | SetArcticView;
