import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith, switchMap, tap, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';
import { SearchResponse } from './search.action';

import * as services from '@services';
import * as models from '@models';

import { SearchActionType } from './search.action';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private asfApiService: services.AsfApiService,
    private mapService: services.MapService,
    private productService: services.ProductService,
  ) {}

  @Effect()
  private makeSearches: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionType.MAKE_SEARCH),

    withLatestFrom(this.searchParams$()),
    map(([_, params]) => params),
    switchMap(
      params => this.asfApiService.query(params)
    ),
    map(response => new SearchResponse(response))
  );

  @Effect()
  private searchResponse: Observable<Action> = this.actions$.pipe(
    ofType<SearchResponse>(SearchActionType.SEARCH_RESPONSE),
    map(action => this.productService.fromResponse(action.payload)),
    map(granule => new granulesStore.SetGranules(granule))
  );

  private searchParams$() {
    return combineLatest(
      this.listParam$(),
      this.filterSearchParams$()
    ).pipe(
      map(
        ([listParam, filterParams]) =>
        Object.values(listParam)[0].length > 0 ?
          listParam :
          filterParams
      ),
      map(params => Object.entries(params)
        .filter(([param, val]) => !!val)
        .reduce(
          (queryParams, [param, val]) => queryParams.append(param, <string>val),
          new HttpParams()
        )
      )
    );
  }

  private filterSearchParams$() {
    return combineLatest(
        this.searchPolygon$(),
        this.selectedPlatforms$(),
        this.dateRange$(),
        this.pathRange$(),
        this.frameRange$(),
      ).pipe(
        map(params => params
          .filter(param => !!Object.values(param)[0])
          .reduce(
            (total, param) =>  ({...total, ...param}),
            {})
        )
    );
  }

  private listParam$() {
    return this.store$.select(granulesStore.getSearchList).pipe(
      withLatestFrom(this.store$.select(filterStore.getListSearchMode).pipe(
        map(mode => mode === models.ListSearchType.GRANULE ? 'granule_list' : 'product_list')
      )),
      tap(v => console.log(v)),
      map(([searchList, param]) => ({ [param]: searchList.join(',') }))
    );
  }

  private searchPolygon$() {
    return combineLatest(
      this.mapService.searchPolygon$.pipe(startWith(null)),
      this.store$.select(filterStore.getShouldOmitSearchPolygon)
    ).pipe(
      map(([polygon, shouldOmitGeoRegion]) => shouldOmitGeoRegion ? null : polygon),
      map(polygon => ({ intersectsWith: polygon }))
    );
  }

  private selectedPlatforms$() {
    return this.store$.select(filterStore.getSelectedPlatforms).pipe(
      map(platforms => platforms
        .map(platform => platform.name)
        .join(',')
        .replace('ALOS PALSAR', 'ALOS')
      ),
      map(platforms => ({ platform: platforms }))
    );
  }

  private dateRange$() {
    return this.store$.select(filterStore.getDateRange).pipe(
      map(range => {
        return [range.start, range.end]
          .filter(date => !!date)
          .map(date => date.toISOString());
      }),
      map(([start, end]) => ({ start, end }))
    );
  }

  private pathRange$() {
    return this.rangeToApiFormat$(
        this.store$.select(filterStore.getPathRange)
    ).pipe(
      map(pathRange => ({ relativeOrbit: pathRange }))
    );
  }

  private frameRange$() {
    return this.rangeToApiFormat$(
      this.store$.select(filterStore.getFrameRange)
    ).pipe(
      map(frameRange => ({ frame: frameRange }))
    );
  }

  private rangeToApiFormat$(source: Observable<models.Range<number | null>>) {
    return source.pipe(
      map(range => Object.values(range)
        .filter(v => !!v)
      ),
      map(range => Array.from(new Set(range))),
      map(range => range.length === 2 ?
        range.join('-') :
        range.pop() || null
      )
    );
  }
}
