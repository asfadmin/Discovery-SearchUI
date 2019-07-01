import { Injectable } from '@angular/core';

import * as filterStore from '@store/filters';
import * as models from '@models';

interface ListSearch {
  list: string[];
}

interface GeoSearch {
  polygon: string;
  filterState: filterStore.FiltersState;
  mission: string | null;
}

interface Search  {
  type: models.SearchType;
  results: number;
  params: GeoSearch | ListSearch;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private shouldSaveSearch = false;

  constructor() {}

  public updateHistoryOnSearch(): void {
  }
}
