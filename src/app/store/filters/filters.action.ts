import { Action } from '@ngrx/store';

export enum FiltersActionType {
  ADD_SELECTED_PLATFORM = '[Filters-Platform] Add Platform Filter',
  REMOVE_SELECTED_PLATFORM = '[Filters-Platform] Remove Platform Filter',
  SET_SELECTED_PLATFORMS = '[Filters-Platform] Set Selected Platforms',

  SET_START_DATE = '[Filters-Date] Set Start Date',
  SET_END_DATE = '[Filters-Date] Set End Date',

  SET_PATH = '[Filters-Path] Set Path',
  SET_FRAME = '[FIlters-Frame] Set Frame'
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

export class SetStartDate implements Action {
  public readonly type = FiltersActionType.SET_START_DATE;

  constructor(public payload: Date) {}
}

export class SetEndDate implements Action {
  public readonly type = FiltersActionType.SET_END_DATE;

  constructor(public payload: Date) {}
}

export class SetPath implements Action {
  public readonly type = FiltersActionType.SET_PATH;

  constructor(public payload: number) {}
}

export class SetFrame implements Action {
  public readonly type = FiltersActionType.SET_FRAME;

  constructor(public payload: number) {}
}

export type FiltersActions =
  | AddSelectedPlatform
  | RemoveSelectedPlatform
  | SetSelectedPlatforms
  | SetStartDate
  | SetEndDate
  | SetPath
  | SetFrame;
