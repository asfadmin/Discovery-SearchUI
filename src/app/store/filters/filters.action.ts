import { Action } from '@ngrx/store';
import { FilterType } from '../../models/';

export enum FiltersActionType {
  ADD_SELECTED_PLATFORM = '[Filters-Platform] Add Platform Filter',
  REMOVE_SELECTED_PLATFORM = '[Filters-Platform] Remove Platform Filter',
  SET_SELECTED_FILTER = '[Filters] Set Filter'
}

export class AddSelectedPlatform implements Action {
  public readonly type = FiltersActionType.ADD_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}

export class RemoveSelectedPlatform implements Action {
  public readonly type = FiltersActionType.REMOVE_SELECTED_PLATFORM;

  constructor(public payload: string) {}
}

export class SetSelectedFilter implements Action {
  public readonly type = FiltersActionType.SET_SELECTED_FILTER;

  constructor(public payload: FilterType) {}
}

export type FiltersActions =
  | AddSelectedPlatform
  | RemoveSelectedPlatform
  | SetSelectedFilter;
