import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { skip, filter, map, switchMap, mergeMap, tap, catchError, debounceTime } from 'rxjs/operators';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as missionStore from '@store/mission';
import * as mapStore from '@store/map';
import * as queueStore from '@store/queue';

import * as services from '@services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  private queueStateKey = 'asf-queue-state';

  public shouldOmitSearchPolygon$ = this.store$.select(filterStore.getShouldOmitSearchPolygon);
  public uiView$ = this.store$.select(uiStore.getUiView);
  public isLoading$ = this.store$.select(searchStore.getIsLoading);

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    map(q => q || [])
  );

  public interactionTypes = models.MapInteractionModeType;
  public searchType: models.SearchType;
  private maxResultsAmountLoading = false;

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private mapService: services.MapService,
    private urlStateService: services.UrlStateService,
    private searchParams$: services.SearchParamsService,
    private polygonValidationService: services.PolygonValidationService,
    private asfSearchApi: services.AsfApiService,
  ) {}

  public ngOnInit(): void {
    this.polygonValidationService.validate();
    this.loadProductQueue();
    this.store$.dispatch(new missionStore.LoadMissions());

    this.actions$.pipe(
      ofType<searchStore.ClearSearch>(searchStore.SearchActionType.CLEAR_SEARCH),
    ).subscribe(
      _ => this.onClearSearch()
    );

    this.queuedProducts$.subscribe(
      products => localStorage.setItem(this.queueStateKey, JSON.stringify(products))
    );

    this.store$.select(uiStore.getSearchType).pipe(
      tap(searchType => this.searchType = searchType),
      skip(1),
      map(searchType => {
        return searchType === models.SearchType.DATASET ?
          models.MapInteractionModeType.DRAW :
          models.MapInteractionModeType.NONE;
      })
    ).subscribe(
      mode => this.store$.dispatch(new mapStore.SetMapInteractionMode(mode))
    );

    this.store$.select(uiStore.getIsSidebarOpen).subscribe(
      isSidebarOpen => isSidebarOpen ?
        this.sidenav.open() :
        this.sidenav.close()
    );

    this.updateMaxSearchResults();
    this.healthCheck();
  }

  private loadProductQueue(): void {
    const queueItemsStr = localStorage.getItem(this.queueStateKey);

    if (queueItemsStr) {
      const queueItems = JSON.parse(queueItemsStr);
      this.store$.dispatch(new queueStore.AddItems(queueItems));
    }
  }

  public onLoadUrlState(): void {
    this.urlStateService.load();
  }

  public onClearSearch(): void {
    this.store$.dispatch(new granulesStore.ClearGranules());
    this.store$.dispatch(new uiStore.CloseBottomMenu());

    if (this.searchType === models.SearchType.DATASET) {
      this.mapService.clearDrawLayer();

      const actions = [
        new filterStore.ClearDatasetFilters(),
        new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW),
        new missionStore.ClearSelectedMission()
      ];

      actions.forEach(
        action => this.store$.dispatch(action)
      );
    } else if (this.searchType === models.SearchType.LIST) {
      this.store$.dispatch(new filterStore.ClearListFilters());
    }
  }

  public onCloseSidebar(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  private updateMaxSearchResults(): void {
    this.searchParams$.getParams().pipe(
      map(params => ({...params, ...{output: 'COUNT'}})),
      tap(_ =>
        this.store$.dispatch(new searchStore.SearchAmountLoading())
      ),
      switchMap(params => this.asfSearchApi.query<any[]>(params).pipe(
          catchError(_ => of(-1))
        )
      ),
    ).subscribe(searchAmount => {
      this.store$.dispatch(new searchStore.SetSearchAmount(+<number>searchAmount));
    });
  }

  private healthCheck(): void {
    this.asfSearchApi.health().pipe(
      map(health => {
        const { ASFSearchAPI, CMRSearchAPI } = health;

        if (!CMRSearchAPI.health.echo['ok?']) {
          this.store$.dispatch(new searchStore.SearchError('CMR is experiencing errors, try searching later.'));
        } else if (!ASFSearchAPI['ok?']) {
          this.store$.dispatch(new searchStore.SearchError('ASF API is experiencing errors, try searching later.'));
        }
      }),
    ).subscribe(_ => _);
  }
}
