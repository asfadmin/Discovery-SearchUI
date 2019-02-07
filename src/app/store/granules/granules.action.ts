import { Action } from '@ngrx/store';

import { Sentinel1Product } from '@models';

export enum GranulesActionType {
  SET_GRANULES = '[Granuels] Set Granules',
  CLEAR = '[Granuels] Clear Granules',

  SET_SELECTED = '[Granules] Set Selected Granule',

  SET_SEARCH_LIST = '[Granules] Set Search List',
}

export class SetGranules implements Action {
  public readonly type = GranulesActionType.SET_GRANULES;

  constructor(public payload: Sentinel1Product[]) {}
}

export class ClearGranules implements Action {
  public readonly type = GranulesActionType.CLEAR;
}

export class SetSelectedGranule implements Action {
  public readonly type = GranulesActionType.SET_SELECTED;

  constructor(public payload: string) {}
}

export class SetSearchList implements Action {
  public readonly type = GranulesActionType.SET_SEARCH_LIST;

  constructor(public payload: string[]) {}
}

export type GranulesActions =
  | SetGranules
  | ClearGranules
  | SetSelectedGranule
  | SetSearchList;
