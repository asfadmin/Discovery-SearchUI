import { Action } from '@ngrx/store';

import { Sentinel1Product } from '@models';

export enum SearchActionType {
  MAKE_SEARCH = '[Search] Make A Search',
  SEARCH_RESPONSE = '[Search] Search Response',
}

export class MakeSearch implements Action {
  public readonly type = SearchActionType.MAKE_SEARCH;
}

export class SearchResponse implements Action {
  public readonly type = SearchActionType.SEARCH_RESPONSE;

  constructor(public payload: Sentinel1Product[]) {}
}

export type SearchActions =
  | MakeSearch
  | SearchResponse;
