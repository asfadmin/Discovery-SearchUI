import { Action } from '@ngrx/store';

export enum FiltersActionType {
  ADD_SELECTED_PLATFORM = '[Filters] Add Platform Filter',
  REMOVE_SELECTED_PLATFORM = '[Filters] Remove Platform Filter'
}

export class AddPlatform implements Action {
  public readonly type = FiltersActionType.ADD_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}

export class RemovePlatform implements Action {
  public readonly type = FiltersActionType.REMOVE_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}


export type FiltersActions =
  | AddPlatform
  | RemovePlatform;
