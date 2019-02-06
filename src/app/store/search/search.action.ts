import { Action } from '@ngrx/store';

export enum SearchActionType {
  MAKE_SEARCH = '[Search] Make A Search',
  SEARCH_RESPONSE = '[Search] Search Response',
}

export class MakeSearch implements Action {
  public readonly type = SearchActionType.MAKE_SEARCH;
}

export class SearchResponse implements Action {
  public readonly type = SearchActionType.SEARCH_RESPONSE;
}

export type SearchActions =
  | MakeSearch
  | SearchResponse;
