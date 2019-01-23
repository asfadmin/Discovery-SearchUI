import { Component, OnInit } from '@angular/core';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, skip } from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';

import { AsfApiService, UrlStateService } from './services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent {

  public granules$ = this.store$.select(granulesStore.getGranules);
  public view$ = this.store$.select(mapStore.getMapView);

  constructor(
    private store$: Store<AppState>,
    private urlStateService: UrlStateService,
  ) {}

  public onLoadUrlState(): void {
    this.urlStateService.load();
  }

  public onNewSearch(): void {
    this.store$.dispatch(new granulesStore.QueryApi());
  }

  public onClearSearch(): void {
    this.store$.dispatch(new granulesStore.ClearGranules());
  }

  public onNewMapView(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }
}
