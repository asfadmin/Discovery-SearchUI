import { Component, OnInit } from '@angular/core';

import { Store, Action } from '@ngrx/store';

import { combineLatest, Subscription, Subject } from 'rxjs';
import { filter, map, switchMap, skip, withLatestFrom, startWith } from 'rxjs/operators';

import { AppState } from './store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as filterStore from '@store/filters';

import { AsfApiService, UrlStateService, MapService } from './services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public granules$ = this.store$.select(granulesStore.getGranules);
  public view$ = this.store$.select(mapStore.getMapView);

  private doSearch = new Subject<void>();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private urlStateService: UrlStateService,
  ) {}

  public ngOnInit(): void {
    const searchState$ = combineLatest(
        this.mapService.searchPolygon$.pipe(
          startWith(null)
        ),
      this.store$.select(filterStore.getSelectedPlatforms).pipe(
        map(platforms => {
          return platforms.map(
            platform => platform.name
          ).join(',');
        }))
    );

    this.doSearch.pipe(
      withLatestFrom(searchState$),
      map(([_, searchState]) => searchState),
      map(
        ([polygon, platforms]) => {
          console.log(polygon, platforms);
          return polygon;
        })
    ).subscribe(v => v);
  }

  public onLoadUrlState(): void {
    this.urlStateService.load();
  }

  public onNewSearch(): void {
    this.doSearch.next();
  }

  public onClearSearch(): void {
    this.store$.dispatch(new granulesStore.ClearGranules());
    this.mapService.clearDrawLayer();
  }

  public onNewMapView(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }
}
