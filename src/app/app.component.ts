import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { QueueComponent } from '@components/header/queue';
import { ProcessingQueueComponent } from '@components/header/processing-queue';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { of, combineLatest } from 'rxjs';
import { skip, filter, map, switchMap, tap, catchError, debounceTime, take, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';

import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { HelpComponent } from '@components/help/help.component';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as mapStore from '@store/map';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';

import * as services from '@services';
import * as models from './models';
import { SearchType } from './models';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'en'},
  ]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  private queueStateKey = 'asf-queue-state-v1';
  private customProductsQueueStateKey = 'asf-custom-products-queue-state-v2';

  public shouldOmitSearchPolygon$ = this.store$.select(filterStore.getShouldOmitSearchPolygon);
  public isLoading$ = this.store$.select(searchStore.getIsLoading);
  public isAutoTheme = false;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    map(q => q || [])
  );
  public numberQueuedProducts: number;
  public queuedCustomProducts: models.QueuedHyp3Job[];
  public currentLanguage: string;

  public interactionTypes = models.MapInteractionModeType;
  public searchType: models.SearchType;

  private helpTopic: string | null;

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
    private savedSearchService: services.SavedSearchService,
    private ccService: NgcCookieConsentService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private notificationService: services.NotificationService,
    private sarviewsService: services.SarviewsEventsService,
    private mapService: services.MapService,
    private themeService: services.ThemingService,
    public translate: TranslateService,
    public language: services.AsfLanguageService,
    public _adapter: DateAdapter<any>,
    private titleService: Title,


@Inject(MAT_DATE_LOCALE) public _locale: string,


  ) {}

  public ngOnInit(): void {
    this.subs.add(
      this.themeService.theme$.subscribe(theme => {
        // check if the user profile has auto in it.
        if (this.isAutoTheme) {
          this.themeService.setTheme(`theme-${theme}`);
        }
      })
    );

    this.subs.add(
      this.store$.select(queueStore.getQueuedJobs).subscribe(
        jobs => this.queuedCustomProducts = jobs
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getCurrentLanguage).subscribe(
        language => {
          this.currentLanguage = language;
        }
      )
    );

    this.subs.add(
    this.store$.select(uiStore.getHelpDialogTopic).subscribe(topic => {
      const previousTopic = this.helpTopic;
      this.helpTopic = topic;

      if (!topic || !!previousTopic) {
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'open-help',
        'open-help': topic
      });

      const ref = this.dialog.open(HelpComponent, {
        panelClass: 'help-panel-config',
        data: {helpTopic: topic},
        width: '80vw',
        height: '80vh',
        maxWidth: '100%',
        maxHeight: '100%'
      });

      ref.afterClosed().subscribe(_ => {
        this.store$.dispatch(new uiStore.SetHelpDialogTopic(null));
      });
    })
    );

    this.subs.add(
    this.store$.select(uiStore.getIsDownloadQueueOpen).subscribe(isDownloadQueueOpen => {
      if (!isDownloadQueueOpen) {
        return;
      }

      this.store$.dispatch(new hyp3Store.LoadUser());

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'open-download-queue',
        'open-download-queue': this.numberQueuedProducts
      });

      const ref = this.dialog.open(QueueComponent, {
        id: 'dlQueueDialog',
        maxWidth: '100vw',
        maxHeight: '100vh'
      });

      this.subs.add(
        ref.afterClosed().subscribe(
          _ => this.store$.dispatch(new uiStore.SetIsDownloadQueueOpen(null))
        )
      );
    })
    );

    this.subs.add(
    this.store$.select(uiStore.getIsOnDemandQueueOpen).subscribe(isOnDemandQueueOpen => {
      if (!isOnDemandQueueOpen) {
        return;
      }

      this.store$.dispatch(new hyp3Store.LoadUser());

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'open-processing-queue',
        'open-processing-queue': this.queuedCustomProducts.length
      });

      const ref = this.dialog.open(ProcessingQueueComponent, {
        id: 'processingQueueDialog',
        maxWidth: '100vw',
        maxHeight: '100vh'
      });

      this.subs.add(
        ref.afterClosed().subscribe(
          _ => this.store$.dispatch(new uiStore.SetIsOnDemandQueueOpen(null))
        )
      );
    })
    );

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

    this.subs.add(
      this.store$.select(uiStore.getSidebar).subscribe(
        sidebar => {
          const isSidebarOpen = sidebar !== models.SidebarType.NONE;

          if (isSidebarOpen) {
            this.sidenav.open();
          } else {
            this.sidenav.close();
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserAuth).pipe(
        filter(userAuth => !!userAuth.token)
      ).subscribe(
        _ => this.store$.dispatch(new userStore.LoadProfile())
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserProfile).pipe(
        withLatestFrom(this.urlStateService.isDefaultSearch$),
      ).subscribe(
        ([profile, isDefaultSearch]) => {
          this.urlStateService.setDefaults(profile);
          this.language.setProfileLanguage(profile.language);
          this.isAutoTheme = profile.theme === 'System Preferences';

          const presets = Object.entries(profile.defaultFilterPresets).map(([_, val2]) => val2).filter(val2 =>val2 !== '')
          if(isDefaultSearch && presets.length > 0) {
            this.loadDefaultFilters(profile)
          }
        })
    );

    this.subs.add(
      this.actions$.pipe(
      ofType<userStore.SetProfile>(userStore.UserActionType.SET_PROFILE),
      withLatestFrom(this.urlStateService.isDefaultSearch$),
      filter(([action, isDefaultSearch]) => {
        const hasCustomDefaults = Object.entries(action.payload.defaultFilterPresets).map(([_, val2]) => val2).filter(val2 =>val2 !== '').length > 0
        return isDefaultSearch && hasCustomDefaults;
      }),
      map(([action, _]) => action.payload.defaultFilterPresets)
      ).subscribe( defaultFilters =>
        this.store$.dispatch(new filterStore.SetDefaultFilters(defaultFilters))
      )
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
      this.actions$.pipe(
        ofType<searchStore.SetSearchType>(searchStore.SearchActionType.SET_SEARCH_TYPE),
        withLatestFrom(this.store$.select(userStore.getUserProfile))
      ).subscribe(
        ([action, profile]) => {
          const saveSearch = this.savedSearchService.makeCurrentSearch(this.searchType);
          this.savedSearchService.saveSearchState(
            this.searchType,
            saveSearch
          );

          this.store$.dispatch(new searchStore.ClearSearch());
          this.store$.dispatch(new searchStore.SetSearchTypeAfterSave(action.payload));

          const searchState = this.savedSearchService.getSearchState(action.payload);

          if (!searchState || action.payload === models.SearchType.DERIVED_DATASETS) {
            this.store$.dispatch(new filterStore.SetDefaultFilters(profile?.defaultFilterPresets));
            return;
          }

          this.searchService.loadSearch(searchState);

          if (this.isEmptySearch(searchState)) {
            this.store$.dispatch(new filterStore.SetDefaultFilters(profile?.defaultFilterPresets));
            return;
          }

          if (
            action.payload !== models.SearchType.BASELINE &&
            action.payload !== models.SearchType.SBAS
          ) {
            this.clearBaselineRanges();
          }

          if (action.payload !== models.SearchType.SARVIEWS_EVENTS) {
            this.clearEventProductFilters();
          }

          this.store$.dispatch(new searchStore.MakeSearch());
        }
      )
    );

    this.subs.add(
      this.queuedProducts$.subscribe(
        products => {
          this.numberQueuedProducts = products.length;
          localStorage.setItem(this.queueStateKey, JSON.stringify(products));
        }
      )
    );

    this.subs.add(
      combineLatest([
        this.store$.select(queueStore.getQueuedJobs),
        this.store$.select(hyp3Store.getProcessingOptions)]
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
          if (searchType === models.SearchType.CUSTOM_PRODUCTS || searchType === models.SearchType.SARVIEWS_EVENTS) {
            this.store$.dispatch(new searchStore.MakeSearch());
          }
        }),
        skip(1),
        map(searchType => {
          return searchType === models.SearchType.DATASET ?
            models.MapInteractionModeType.DRAW :
            models.MapInteractionModeType.NONE;
        })
      ).subscribe(
        (mode) => {
        this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
        })
    );

    this.updateMaxSearchResults();
    this.healthCheck();

    if (!this.ccService.hasConsented()) {
      const options = {
        closeButton: true,
        disableTimeOut: true,
        enableHtml: true,
        tapToDismiss: false,
      };

      const toast = this.notificationService.info(
        'This website uses cookies to ensure you get the best \
        experience on our website. \
        <a href="https://cookiesandyou.com/" target="_blank">Learn More</a>',
        '',
        options
      );

      toast.onHidden.pipe(take(1)).subscribe(() => {
        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        document.cookie = `cookieconsent_status=dismiss; expires=${expireDate.toUTCString()}`;
      });
    }

    this.subs.add(this.ccService.popupOpen$.subscribe(_ => _));
    this.subs.add(this.ccService.popupClose$.subscribe(_ => _));
    this.subs.add(this.ccService.revokeChoice$.subscribe(_ => _));

    const matIcons = [
      'hyp3',
      'gridlines',
      'Earthquake_inactive',
      'Earthquake',
      'Volcano_inactive',
      'Volcano',
      'arctic',
      'equatorial',
      'antarctic',
      'hgrip',
      'unpin',
      'hgrip',
      'vgrip',
    ];

    matIcons.forEach((iconName) => {
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/icons/${iconName}.svg`)
      );
    });
  }

  public ngAfterViewInit(): void {
    this.subs.add(this.translate.get('ASF_DATA_SEARCH_TITLE').subscribe(title => {
      this.titleService.setTitle(title);
    }));
  }

  public onLoadUrlState(): void {
    this.urlStateService.load();
  }

  public onClearSearch(): void {
    this.store$.dispatch(new scenesStore.ClearScenes());
    this.store$.dispatch(new scenesStore.SetSelectedSarviewsEvent(''));
    this.mapService.clearDrawLayer();
    this.store$.dispatch(new uiStore.CloseResultsMenu());
    this.searchService.clear(this.searchType);
    this.store$.dispatch(new searchStore.SetSearchOutOfDate(false));
  }

  public onCloseSidebar(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  private isEmptySearch(searchState): boolean {
    if (searchState.searchType === models.SearchType.LIST) {
      return searchState.filters.list.length < 1;
    } else if (searchState.searchType === models.SearchType.BASELINE) {
      return !searchState.filters.filterMaster;
    } else if (searchState.searchType === models.SearchType.SBAS) {
      return !searchState.filters.reference;
    } else if (searchState.searchType === models.SearchType.SARVIEWS_EVENTS) {
      return searchState.filters.selectedEventID !== '';
    }

    return false;
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

  private loadDefaultFilters(profile: models.UserProfile): void {
    this.urlStateService.setDefaults(profile);
    if (this.searchType !== models.SearchType.LIST
      && this.searchType !== models.SearchType.CUSTOM_PRODUCTS
      && this.searchType !== models.SearchType.SARVIEWS_EVENTS) {
      const defaultFilterID = profile.defaultFilterPresets[this.searchType];
      if (!!defaultFilterID) {
        this.store$.dispatch(new userStore.LoadFiltersPreset(defaultFilterID));
      }
    }
  }

  private updateMaxSearchResults(): void {
    const checkAmount = this.searchParams$.getlatestParams.pipe(
      distinctUntilChanged((previous, current) => {
        for(let key of Object.keys(previous)) {
          if(previous[key] !== current[key]) {
            return false;
          }
        }
        return true
      }),
      debounceTime(200),
      filter(_ => this.searchType !== SearchType.SARVIEWS_EVENTS
        && this.searchType !== SearchType.CUSTOM_PRODUCTS
        && this.searchType !== SearchType.BASELINE
        && this.searchType !== SearchType.SBAS),
      map(params => ({...params, output: 'COUNT'})),
      tap(_ =>
        this.store$.dispatch(new searchStore.SearchAmountLoading())
      ),
      switchMap(params => {
        if (this.searchType === models.SearchType.SARVIEWS_EVENTS) {
          return this.sarviewsService.filteredSarviewsEvents$().pipe(map(events => events.length));
        }
        return this.asfSearchApi.query<any[]>(params).pipe(
        catchError(resp => {
          const { error } = resp;
          if (!resp.ok || error && error.includes('VALIDATION_ERROR')) {
            return of(0);
          }

          return of(-1);
        })
      );
      }
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
      this.asfSearchApi.loadMissions$.subscribe(
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
          // eslint-disable-next-line @typescript-eslint/naming-convention
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
      id: 'Error',
      text: 'ASF is experiencing errors loading data.  Please try again later.',
      name: 'Error',
      type: 'error'
    };
  }

  private clearBaselineRanges() {
    this.store$.dispatch(new filtersStore.ClearPerpendicularRange());
    this.store$.dispatch(new filtersStore.ClearTemporalRange());
  }

  private clearEventProductFilters() {
    this.store$.dispatch(new filterStore.ClearHyp3ProductTypes());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
