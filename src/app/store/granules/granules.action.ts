import { Action } from '@ngrx/store';

import { CMRProduct } from '@models';

export enum GranulesActionType {
  SET_GRANULES = '[Granuels] Set Granules',
  CLEAR = '[Granuels] Clear Granules',

  SET_FOCUSED_GRANULE = '[Granules] Set Focused Granule',
  CLEAR_FOCUSED_GRANULE = '[Granules] Clear Focused Granule',

  SET_SELECTED_GRANULE = '[Granules] Set Selected Granule',
  SELECT_NEXT_GRANULE = '[Granules] Select Next Granule',
  SELECT_PREVIOUS_GRANULE = '[Granules] Select Previous Granule',

  SET_SEARCH_LIST = '[Granules] Set Search List',
}

export class SetGranules implements Action {
  public readonly type = GranulesActionType.SET_GRANULES;

  constructor(public payload: CMRProduct[]) {}
}

export class ClearGranules implements Action {
  public readonly type = GranulesActionType.CLEAR;
}

export class SetSelectedGranule implements Action {
  public readonly type = GranulesActionType.SET_SELECTED_GRANULE;

  constructor(public payload: string) {}
}

export class SelectNextGranule implements Action {
  public readonly type = GranulesActionType.SELECT_NEXT_GRANULE;
}

export class SelectPreviousGranule implements Action {
  public readonly type = GranulesActionType.SELECT_PREVIOUS_GRANULE;
}


export class SetSearchList implements Action {
  public readonly type = GranulesActionType.SET_SEARCH_LIST;

  constructor(public payload: string[]) {}
}

export class SetFocusedGranule implements Action {
  public readonly type = GranulesActionType.SET_FOCUSED_GRANULE;

  constructor(public payload: CMRProduct) {}
}

export class ClearFocusedGranule implements Action {
  public readonly type = GranulesActionType.CLEAR_FOCUSED_GRANULE;
}

export type GranulesActions =
  | SetGranules
  | ClearGranules
  | SetSelectedGranule
  | SelectNextGranule
  | SelectPreviousGranule
  | SetSearchList
  | SetFocusedGranule
  | ClearFocusedGranule;
