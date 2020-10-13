import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { MatDialog } from '@angular/material/dialog';
import { QueueComponent } from '@components/header/queue';
import { ProcessingQueueComponent } from '@components/header/processing-queue';
import { ClipboardService } from 'ngx-clipboard';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';

import { PreferencesComponent } from './preferences/preferences.component';
import { HelpComponent } from '@components/help/help.component';
import { CustomizeEnvComponent } from './customize-env/customize-env.component';

import { AuthService, AsfApiService, EnvironmentService, ScreenSizeService } from '@services';
import { CMRProduct, Breakpoints, UserAuth, SavedSearchType, QueuedHyp3Job } from '@models';

import { collapseAnimation, rubberBandAnimation,
         zoomInUpAnimation,  tadaAnimation, wobbleAnimation } from 'angular-animations';

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
  public maturity = this.env.maturity;

  public userAuth: UserAuth;
  public isLoggedIn = false;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  private subs = new SubSink();

  public queuedProducts: CMRProduct[];
  public queuedCustomProducts: QueuedHyp3Job[];

  public qOnDemandState = false;
  public qProdState = false;
  public lastOnDemandCount = 0;
  public lastQProdCount = 0;

  constructor(
    public authService: AuthService,
    public env: EnvironmentService,
    public asfApiService: AsfApiService,
    public clipboard: ClipboardService,
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
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-download-queue',
      'open-download-queue': this.queuedProducts.length
    });

    if (this.queuedProducts.length <= 0) {
      return;
    }

    this.dialog.open(QueueComponent, {
      id: 'dlQueueDialog',
      maxWidth: '100vw',
      maxHeight: '100vh'
    });

  }

  public onAccountButtonClicked() {
    this.subs.add(
      this.authService.login$().subscribe(
        user => this.store$.dispatch(new userStore.Login(user))
      )
    );
  }

  public onLogout(): void {
    this.subs.add(
      this.authService.logout$().subscribe(
        _ => this.store$.dispatch(new userStore.Logout())
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
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-help',
      'open-help': helpSelection
    });

    this.dialog.open(HelpComponent, {
      panelClass: 'help-panel-config',
      data: {helpTopic: helpSelection},
      width: '80vw',
      height: '80vh',
      maxWidth: '100%',
      maxHeight: '100%'
    });
  }

  public onOpenWhatsNew(): void {
    const url = 'https://docs.google.com/document/d/e/2PACX-1vSqQxPT8nhDQfbCLS8gBZ9SqSEeJy8BdSCiYVlBOXwsFwJ6_ct7pjtOqbXHo0Q3wzinzvO8bGWtHj0H/pub';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-whats-new',
      'open-whats-new': url
    });

    window.open(
      url,
      '_blank'
    );
  }

  public onOpenASFWebSite(): void {
    const url = this.asfWebsiteUrl;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-asf-web-site',
      'open-asf-web-site': url
    });

    window.open(
      url,
      '_blank'
    );
  }

  public onOpenAPIWebSite(): void {
    const url = this.asfWebsiteUrl + '/api';

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-api-web-site',
      'open-api-web-site': url
    });

    window.open(
      url,
      '_blank'
    );
  }

  public onOpenDerivedDataset(dataset_path: string, dataset_name: string): void {
    const url = this.asfWebsiteUrl + dataset_path;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-derived-dataset',
      'open-derived-dataset': dataset_name
    });

    window.open(
      url,
      '_blank'
    );
  }

  public onOpenCustomizeEnv(): void {
    this.dialog.open(CustomizeEnvComponent, {
      width: '800px',
      height: '1000px',
      maxWidth: '100%',
      maxHeight: '100%'
    });
  }

  public onOpenSavedSearches(): void {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-saved-searches',
      'open-saved-searches': true
    });

    this.store$.dispatch(new uiStore.SetSaveSearchOn(false));
    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.SAVED));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenSearchHistory() {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-search-history',
      'open-search-history': true
    });

    this.store$.dispatch(new uiStore.SetSaveSearchOn(false));
    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.HISTORY));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenProcessingQueue() {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'open-processing-queue',
      'open-processing-queue': this.queuedCustomProducts.length
    });

    if (this.queuedCustomProducts.length <= 0) {
      return;
    }

    this.dialog.open(ProcessingQueueComponent, {
      id: 'processingQueueDialog',
      maxWidth: '100vw',
      maxHeight: '100vh'
    });
  }

  public onCopy(): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'copy-search-link',
      'copy-search-link': window.location.href
    });
    this.clipboard.copyFromContent(window.location.href);
  }

  public onShareWithEmail() {
    const subject = `New Search - ${encodeURIComponent(document.title)}`;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'share-with-email',
      'share-with-email': encodeURIComponent(document.URL)
    });

    window.open(
      `mailto:?subject=${subject}` +
      `&body=${encodeURIComponent(document.URL)}`
    );
  }

  public isDevMode(): boolean {
    return !this.env.isProd;
  }

  public onTestSelected(): void {
    this.setMaturity('test');
  }

  public onProdSelected(): void {
    this.setMaturity('prod');
  }

  private setMaturity(maturity: string): void {
    this.maturity = maturity;
    this.env.setMaturity(maturity);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
