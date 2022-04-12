import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import { PreferencesComponent } from './preferences/preferences.component';

import { AuthService, AsfApiService, EnvironmentService, ScreenSizeService } from '@services';
import { CMRProduct, Breakpoints, UserAuth, SidebarType, QueuedHyp3Job, SearchType, AnalyticsEvent } from '@models';

import { collapseAnimation, rubberBandAnimation,
         zoomInUpAnimation,  tadaAnimation, wobbleAnimation } from 'angular-animations';
import { ThemePalette } from '@angular/material/core';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.scss'],
  animations: [
    rubberBandAnimation(),
    collapseAnimation(),
    zoomInUpAnimation(),
    tadaAnimation({ duration: 1500 }),
    wobbleAnimation()
  ]
})
export class HeaderButtonsComponent implements OnInit, OnDestroy {
  anio: number = new Date().getFullYear();
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';

  public userAuth: UserAuth;
  public isLoggedIn = false;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  private subs = new SubSink();

  public accentPalette: ThemePalette = 'accent' as const;
  public primaryPalette: ThemePalette = 'primary' as const;

  public queuedProducts: CMRProduct[];
  public queuedCustomProducts: QueuedHyp3Job[];

  public qOnDemandState = false;
  public qProdState = false;
  public lastOnDemandCount = 0;
  public lastQProdCount = 0;

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = SearchType;

  constructor(
    public authService: AuthService,
    public env: EnvironmentService,
    public asfApiService: AsfApiService,
    private screenSize: ScreenSizeService,
    private dialog: MatDialog,
    private store$: Store<AppState>,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(userStore.getUserAuth).subscribe(
        user => this.userAuth = user
      )
    );

    this.subs.add(
      this.store$.select(queueStore.getQueuedProducts).subscribe(
        products => {
          this.queuedProducts = products;
          if ( this.lastQProdCount !== products.length ) {
            this.lastQProdCount = products.length;
            this.qProdState = !this.qProdState;
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(queueStore.getQueuedJobs).subscribe(
        jobs => {
          this.queuedCustomProducts = jobs;
          if (this.lastOnDemandCount !== jobs.length) {
            this.lastOnDemandCount = jobs.length;
            this.qOnDemandState = !this.qOnDemandState;
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );
  }

  public onOpenDownloadQueue(): void {
    this.store$.dispatch(new uiStore.SetIsDownloadQueueOpen(true));
  }

  public onSetSearchTypeOnDemand(): void {
    const searchType = SearchType.CUSTOM_PRODUCTS;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'search-type-selected',
      'search-type': searchType
    });
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }

  public onAccountButtonClicked() {
    this.subs.add(
      this.authService.login$().subscribe(
        user => {
          this.store$.dispatch(new userStore.Login(user));
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'account-button-clicked',
            'account-button-clicked': user
          });
        }
      )
    );
  }

  public onLogout(): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'logout',
      'logout': this.userAuth
    });

    this.subs.add(
      this.authService.logout$().subscribe(
        _ => {
          this.store$.dispatch(new userStore.Logout());
        }
      )
    );
  }

  public onOpenPreferences(): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-preferences',
      'open-preferences': true
    });

    const dialogRef = this.dialog.open(PreferencesComponent, {
      maxWidth: '100%',
      maxHeight: '100%'
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(
        _ => this.store$.dispatch(new userStore.SaveProfile())
      )
    );
  }

  public onOpenHelp(helpSelection: string): void {
    this.store$.dispatch(new uiStore.SetHelpDialogTopic(helpSelection));
  }

  public onOpenUserGuide(): void {
    const url = 'https://docs.asf.alaska.edu/vertex/manual/';
    const analyticsEvent = {
      name: 'open-user-guide',
      value: url
    };

    this.openNewWindow(url, analyticsEvent);
  }
  public onOpenHyP3Guide(): void {
    const url = 'https://hyp3-docs.asf.alaska.edu/';
    const analyticsEvent = {
      name: 'open-user-guide',
      value: url
    };

    this.openNewWindow(url, analyticsEvent);
  }

  public onOpenWhatsNew(): void {
    const url = 'https://docs.google.com/document/d/e/2PACX-1vSqQxPT8nhDQfbCLS8gBZ9SqSEeJy8BdSCiYVlBOXwsFwJ6_ct7pjtOqbXHo0Q3wzinzvO8bGWtHj0H/pub';
    const analyticsEvent = {
      name: 'open-whats-new',
      value: url
    };

    this.openNewWindow(url, analyticsEvent);
  }

  public onOpenASFWebSite(): void {
    const url = this.asfWebsiteUrl;
    const analyticsEvent = {
      name: 'open-asf-web-site',
      value: url
    };

    this.openNewWindow(url, analyticsEvent);
  }

  public onOpenOnDemandDocs(): void {
    const url = 'https://hyp3-docs.asf.alaska.edu/';
    const analyticsEvent = {
      name: 'open-hyp3-docs',
      value: url
    };

    this.openNewWindow(url, analyticsEvent);
  }

  public onOpenAPIWebSite(): void {
    const url = `https://docs.asf.alaska.edu/api/basics/`;
    const analyticsEvent = {
      name: 'open-api-web-site',
      value: url
    };

    this.openNewWindow(url, analyticsEvent);
  }

  public onOpenSavedSearches(): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-saved-searches',
      'open-saved-searches': true
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.SAVED_SEARCHES));
  }

  public onOpenSavedFilters(): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-saved-filters',
      'open-saved-filters': true
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.USER_FILTERS));
  }

  public onOpenSearchHistory() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-search-history',
      'open-search-history': true
    });

    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.SEARCH_HISTORY));
  }

  public onOpenProcessingQueue() {
    this.store$.dispatch(new uiStore.SetIsOnDemandQueueOpen(true));
  }

  public onOpenSubscriptions() {
    this.store$.dispatch(new uiStore.OpenSidebar(SidebarType.ON_DEMAND_SUBSCRIPTIONS));
  }

  private openNewWindow(url, analyticsEvent: AnalyticsEvent): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': analyticsEvent.name,
      'open-derived-dataset': analyticsEvent.value
    });

    window.open(url, '_blank');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
