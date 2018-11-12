import { Component, OnInit } from '@angular/core';

import { Store, Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from './store';
import {
  getGranules, getLoading, getError,
  ClearGranules
} from './store/granules';
import {
  getMapView,
  SetArcticView, SetEquitorialView, SetAntarcticView
} from './store/map';

import { AsfApiService, RoutedSearchService } from './services';

import { SentinelGranule, MapViewType } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public granules$ = this.store$.select(getGranules);
  public loading$  = this.store$.select(getLoading);
  public error$ = this.store$.select(getError);
  public view$ = this.store$.select(getMapView);

  constructor(
    private routedSearchService: RoutedSearchService,
    private store$: Store<AppState>
  ) {}

  public ngOnInit() {
  }

  public onNewSearch(query: string): void {
    this.routedSearchService.query(query);
  }

  public onClearGranules(): void {
    this.routedSearchService.clear();
    this.store$.dispatch(new ClearGranules());
  }

  public onNewMapView(view: MapViewType): void {
    const newMapViewAction = this.getActionFor(view);
    this.store$.dispatch(newMapViewAction);
  }

  private getActionFor(view: MapViewType): Action {
    switch (view) {
      case MapViewType.ARCTIC: {
        return new SetArcticView();
      }
      case MapViewType.EQUITORIAL: {
        return new SetEquitorialView();
      }
      case MapViewType.ANTARCTIC: {
        return new SetAntarcticView();
      }
    }
  }
}
