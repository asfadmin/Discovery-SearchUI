import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SubSink } from 'subsink';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { of, combineLatest, timer } from 'rxjs';
import { skip, filter, map, switchMap, mergeMap, tap, catchError, debounceTime, withLatestFrom } from 'rxjs/operators';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as mapStore from '@store/map';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';

import * as services from '@services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private queueStateKey = 'asf-queue-state';

  public shouldOmitSearchPolygon$ = this.store$.select(filterStore.getShouldOmitSearchPolygon);
  public uiView$ = this.store$.select(uiStore.getUiView);
  public isLoading$ = this.store$.select(searchStore.getIsLoading);

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    map(q => q || [])
  );

  public interactionTypes = models.MapInteractionModeType;
  public searchType: models.SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private mapService: services.MapService,
    private urlStateService: services.UrlStateService,
    private searchParams$: services.SearchParamsService,
    private polygonValidationService: services.PolygonValidationService,
    private asfSearchApi: services.AsfApiService,
    private authService: services.AuthService
  ) {}

  public ngOnInit(): void {
    this.store$.dispatch(new uiStore.LoadBanners());

    this.polygonValidationService.validate();
    this.loadProductQueue();
    this.loadMissions();

    this.store$.select(userStore.getUserAuth).pipe(
      filter(userAuth => !!userAuth.token)
    ).subscribe(
      userAuth => console.log(userAuth)
    );

    const user = this.authService.getUser();
    if (user.id) {
      this.store$.dispatch(new userStore.SetUserAuth(user));
    }

    this.subs.add(
      this.actions$.pipe(
        ofType<searchStore.ClearSearch>(searchStore.SearchActionType.CLEAR_SEARCH),
      ).subscribe(
        _ => this.onClearSearch()
      )
    );

    this.subs.add(
      this.queuedProducts$.subscribe(
        products => localStorage.setItem(this.queueStateKey, JSON.stringify(products))
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).pipe(
        tap(searchType => this.searchType = searchType),
        skip(1),
        map(searchType => {
          return searchType === models.SearchType.DATASET ?
            models.MapInteractionModeType.DRAW :
            models.MapInteractionModeType.NONE;
        })
      ).subscribe(
        mode => this.store$.dispatch(new mapStore.SetMapInteractionMode(mode))
      )
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
    this.store$.dispatch(new scenesStore.ClearScenes());
    this.store$.dispatch(new uiStore.CloseResultsMenu());

    if (this.searchType === models.SearchType.DATASET) {
      this.mapService.clearDrawLayer();

      const actions = [
        new filterStore.ClearDatasetFilters(),
        new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW),
      ];

      actions.forEach(
        action => this.store$.dispatch(action)
      );
    } else if (this.searchType === models.SearchType.LIST) {
      this.store$.dispatch(new filterStore.ClearListFilters());
    }
  }

  private updateMaxSearchResults(): void {
    const checkAmount = this.searchParams$.getParams().pipe(
      map(params => ({...params, ...{output: 'COUNT'}})),
      tap(_ =>
        this.store$.dispatch(new searchStore.SearchAmountLoading())
      ),
      switchMap(params => this.asfSearchApi.query<any[]>(params).pipe(
        catchError(resp => {
          const { error } = resp;
          if (!resp.ok || error && error.includes('VALIDATION_ERROR')) {
            return of(0);
          }

          return of(-1);
        })
        )
      ),
    );

    this.subs.add(
      checkAmount.subscribe(searchAmount => {
        const amount = +<number>searchAmount;

        if (amount < 0) {
          this.setErrorBanner();
        }

        this.store$.dispatch(new searchStore.SetSearchAmount(amount));
      })
    );
  }

  private loadMissions(): void {
    this.subs.add(
      combineLatest(
        this.asfSearchApi.missionSearch(models.MissionDataset.S1_BETA).pipe(
          map(resp => ({[models.MissionDataset.S1_BETA]: resp.result}))
        ),
        this.asfSearchApi.missionSearch(models.MissionDataset.AIRSAR).pipe(
          map(resp => ({[models.MissionDataset.AIRSAR]: resp.result}))
        ),
        this.asfSearchApi.missionSearch(models.MissionDataset.UAVSAR).pipe(
          map(resp => ({[models.MissionDataset.UAVSAR]: resp.result}))
        )
      ).pipe(
        map(missions => missions.reduce(
          (allMissions, mission) => ({ ...allMissions, ...mission }),
          {}
        )),
      ).subscribe(
        missionsByDataset => this.store$.dispatch(
          new filterStore.SetMissions(missionsByDataset)
        )
      )
    );
  }

  private healthCheck(): void {
    this.subs.add(
      this.asfSearchApi.health().pipe(
        map(health => {
          const { ASFSearchAPI, CMRSearchAPI } = health;

          return 'error' in CMRSearchAPI || !ASFSearchAPI['ok?'];
        }),
        map(isError => {
          if (!isError) {
            return;
          }

          this.setErrorBanner();
        }),
        catchError(
          _ => {
            this.setErrorBanner();

            return of(null);
          }
        )
      ).subscribe(_ => _)
    );
  }

  private setErrorBanner(): void {
    this.store$.dispatch(new uiStore.AddBanners([this.errorBanner()]));
  }

  private errorBanner() {
    return  {
      text: 'ASF is experiencing errors loading data.  Please try again later.',
      type: 'error',
      target: ['vertex']
    };
  }

  ngOnDestroy() {

  }
}
