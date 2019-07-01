import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import * as filterStore from '@store/filters';
import * as models from '@models';

export interface ListSearch {
  list: string[];
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

  constructor() {
    this.searchHistory$.subscribe(console.log);
  }

  public add(search: Search): void {
    const searches = this.searchHistory$.getValue();

    const newHistory = [search, ...searches].slice(0, 9);

    this.searchHistory$.next(newHistory);
  }
}
