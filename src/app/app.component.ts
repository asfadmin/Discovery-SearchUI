import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SubSink } from 'subsink';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { of, combineLatest } from 'rxjs';
import { skip, filter, map, switchMap, tap, catchError, debounceTime } from 'rxjs/operators';

import { NgcCookieConsentService } from 'ngx-cookieconsent';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as mapStore from '@store/map';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';

import * as services from '@services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  private queueStateKey = 'asf-queue-state';
  private customProductsQueueStateKey = 'asf-custom-products-queue-state';

  public shouldOmitSearchPolygon$ = this.store$.select(filterStore.getShouldOmitSearchPolygon);
  public isLoading$ = this.store$.select(searchStore.getIsLoading);

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    map(q => q || [])
  );

  public interactionTypes = models.MapInteractionModeType;
  public searchType: models.SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private urlStateService: services.UrlStateService,
    private searchParams$: services.SearchParamsService,
    private polygonValidationService: services.PolygonValidationService,
    private asfSearchApi: services.AsfApiService,
    private authService: services.AuthService,
    private screenSize: services.ScreenSizeService,
    private searchService: services.SearchService,
    private ccService: NgcCookieConsentService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {}

  public ngOnInit(): void {
    this.store$.dispatch(new uiStore.LoadBanners());
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.polygonValidationService.validate();
    this.loadProductQueue();
    this.loadCustomProductsQueue();
    this.loadMissions();

    this.store$.select(uiStore.getIsSidebarOpen).subscribe(
      isSidebarOpen => isSidebarOpen ?
        this.sidenav.open() :
        this.sidenav.close()
    );

    this.subs.add(
      this.store$.select(userStore.getUserAuth).pipe(
        filter(userAuth => !!userAuth.token)
      ).subscribe(
        _ => this.store$.dispatch(new userStore.LoadProfile())
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe(
        profile => {
          this.urlStateService.setDefaults(profile);
        })
    );

    const user = this.authService.getUser();
    if (user.id) {
      this.store$.dispatch(new userStore.Login(user));
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
      combineLatest(
        this.store$.select(queueStore.getQueuedJobs),
        this.store$.select(hyp3Store.getProcessingOptions)
      ).subscribe(
       ([jobs, options]) => localStorage.setItem(
         this.customProductsQueueStateKey, JSON.stringify({jobs, options})
       )
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).pipe(
        tap(searchType => this.searchType = searchType),
        tap(searchType => {
          if (searchType === models.SearchType.CUSTOM_PRODUCTS) {
            this.store$.dispatch(new searchStore.MakeSearch());
          }
        }),
        skip(1),
        map(searchType => {
          return searchType === models.SearchType.DATASET ?
            models.MapInteractionModeType.DRAW :
            models.MapInteractionModeType.NONE;
        }),
      ).subscribe(
        mode => this.store$.dispatch(new mapStore.SetMapInteractionMode(mode))
      )
    );

    this.updateMaxSearchResults();
    this.healthCheck();

    this.subs.add(this.ccService.popupOpen$.subscribe(_ => _));
    this.subs.add(this.ccService.popupClose$.subscribe(_ => _));
    this.subs.add(this.ccService.revokeChoice$.subscribe(_ => _));

    this.matIconRegistry.addSvgIcon(
      'hyp3',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/hyp3.svg')
    );
  }

  private loadProductQueue(): void {
    const queueItemsStr = localStorage.getItem(this.queueStateKey);

    if (queueItemsStr) {
      const queueItems = JSON.parse(queueItemsStr);
      this.store$.dispatch(new queueStore.AddItems(queueItems));
    }
  }

  private loadCustomProductsQueue(): void {
    const queueItemsStr = localStorage.getItem(this.customProductsQueueStateKey);

    if (queueItemsStr) {
      const {jobs, options} = JSON.parse(queueItemsStr);
      this.store$.dispatch(new queueStore.AddJobs(jobs));
      this.store$.dispatch(new hyp3Store.SetProcessingOptions(options));
    }
  }

  public onCloseSidebar(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  public onLoadUrlState(): void {
    this.urlStateService.load();
  }

  public onClearSearch(): void {
    this.store$.dispatch(new scenesStore.ClearScenes());
    this.store$.dispatch(new uiStore.CloseResultsMenu());

    this.searchService.clear(this.searchType, this.breakpoint);
  }

  private updateMaxSearchResults(): void {
    const checkAmount = this.searchParams$.getParams().pipe(
      debounceTime(200),
      map(params => ({...params, output: 'COUNT'})),
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
      this.asfSearchApi.loadMissions$().subscribe(
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
          if (isError) {
            this.setErrorBanner();
          }
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

  private errorBanner(): models.Banner {
    return  {
      text: 'ASF is experiencing errors loading data.  Please try again later.',
      name: 'error',
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
