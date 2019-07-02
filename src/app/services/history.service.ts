import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import * as filterStore from '@store/filters';
import * as models from '@models';

export interface ListSearch {
  list: string[];
  type: models.ListSearchType;
}

export interface GeoSearch {
  polygon: string;
  filterState: filterStore.FiltersState;
  mission: string | null;
}

export interface Search {
  type: models.SearchType;
  results: number;
  params: GeoSearch | ListSearch;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  public searchHistory$ = new BehaviorSubject<Search[]>([]);
  private historyKey = 'vertex-search-history';

  constructor() {
    const searchHistoryStr = localStorage.getItem(this.historyKey);
    if (searchHistoryStr) {
      const searchHistory = JSON.parse(searchHistoryStr);
      this.searchHistory$.next(searchHistory);
    }

    this.searchHistory$.subscribe(
      searches => localStorage.setItem(this.historyKey, JSON.stringify(searches))
    );
  }

  public add(search: Search): void {
    const searches = this.searchHistory$.getValue();

    const newHistory = [search, ...searches].slice(0, 9);

    this.searchHistory$.next(newHistory);
  }

  public clear(): void {
    this.searchHistory$.next([]);
  }
}
