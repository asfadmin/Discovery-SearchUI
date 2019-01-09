import { Action } from '@ngrx/store';

export enum FiltersActionType {
  ADD_SELECTED_PLATFORM = '[Filters-Platform] Add Platform Filter',
  REMOVE_SELECTED_PLATFORM = '[Filters-Platform] Remove Platform Filter',
  SET_SELECTED_PLATFORMS = '[Filters-Platform] Set Selected Platforms'
}

export class AddSelectedPlatform implements Action {
  public readonly type = FiltersActionType.ADD_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}

export class RemoveSelectedPlatform implements Action {
  public readonly type = FiltersActionType.REMOVE_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}

export class SetSelectedPlatforms implements Action {
  public readonly type = FiltersActionType.SET_SELECTED_PLATFORMS;

  constructor(public payload: string[]) {}
}

export type FiltersActions =
  | AddSelectedPlatform
  | RemoveSelectedPlatform
  | SetSelectedPlatforms;
