import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../store';
import * as fromGranules from './../store/granules/granules.action';

@Injectable({
  providedIn: 'root'
})
export class RoutedSearchService {
  constructor(private store$: Store<AppState>) {}

  public query(granuleName: string) {
    const baseParams = {
      maxResults: 5,
      output: 'json'
    };

    const queryParams = {
      ...baseParams,
      granule_list: granuleName
    };

    this.store$.dispatch(new fromGranules.QueryApi(granuleName));
  }

  public clear(): void {
    this.store$.dispatch(new fromGranules.ClearGranules());
  }
}


function parseQueryStringToDictionary(queryString) {
  const dictionary = {};

  if (queryString === '') {
    return dictionary;
  }

  if (queryString.indexOf('?') === 0) {
    queryString = queryString.substr(1);
  }

  const parts = queryString.split('&');

  for (const p of parts) {
    const keyValuePair = p.split('=');

    const key = keyValuePair[0];
    let value = keyValuePair[1];

    value = decodeURIComponent(value);
    value = value.replace(/\+/g, ' ');

    dictionary[key] = value;
  }

  return dictionary;
}

