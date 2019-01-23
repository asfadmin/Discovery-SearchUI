import { Component, OnInit } from '@angular/core';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, skip } from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from './store/granules';
import * as mapStore from './store/map';
import * as uiStore from './store/ui';
import * as filterStore from './store/filters';

import { AsfApiService, RoutedSearchService, UrlStateService } from './services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public granules$ = this.store$.select(granulesStore.getGranules);
  public loading$  = this.store$.select(granulesStore.getLoading);
  public view$ = this.store$.select(mapStore.getMapView);

  constructor(
    private routedSearchService: RoutedSearchService,
    private store$: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.routedSearchService.query('');
  }

  public onNewSearch(query: string): void {
    this.routedSearchService.query(query);
  }

  public onClearGranules(): void {
    this.routedSearchService.clear();
    this.store$.dispatch(new granulesStore.ClearGranules());
  }

  public onNewMapView(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }
}
