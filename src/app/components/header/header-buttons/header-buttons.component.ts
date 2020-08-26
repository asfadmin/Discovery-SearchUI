import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QueueComponent } from '@components/header/queue';
import { ProcessingQueueComponent } from '@components/header/processing-queue';
import { ClipboardService } from 'ngx-clipboard';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';

import { PreferencesComponent } from './preferences/preferences.component';
import { HelpComponent } from '@components/help/help.component';
import { CustomizeEnvComponent } from './customize-env/customize-env.component';

import { AuthService, AsfApiService, EnvironmentService, ScreenSizeService } from '@services';
import { CMRProduct, Breakpoints, UserAuth, SavedSearchType } from '@models';

@Component({
  selector: 'app-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.scss']
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
        products => this.queuedProducts = products
      )
    );

    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );
  }

  public onOpenDownloadQueue(): void {
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
        user => this.store$.dispatch(new userStore.Logout())
      )
    );
  }

  public onOpenPreferences(): void {
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
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = 'help-panel-config';
    dialogConfig.data = {helpTopic: helpSelection};
    dialogConfig.width = '80vw';
    dialogConfig.height = '80vh';
    dialogConfig.maxWidth = '100%';
    dialogConfig.maxHeight = '100%';

    const dialogRef = this.dialog.open(HelpComponent, dialogConfig);
  }

  public onOpenCustomizeEnv(): void {
    const dialogRef = this.dialog.open(CustomizeEnvComponent, {
      width: '800px',
      height: '1000px',
      maxWidth: '100%',
      maxHeight: '100%'
    });
  }

  public onOpenSavedSearches(): void {
    this.store$.dispatch(new uiStore.SetSaveSearchOn(false));
    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.SAVED));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenSearchHistory() {
    this.store$.dispatch(new uiStore.SetSaveSearchOn(false));
    this.store$.dispatch(new uiStore.SetSavedSearchType(SavedSearchType.HISTORY));
    this.store$.dispatch(new uiStore.OpenSidebar());
  }

  public onOpenHyp3Dialog() {
    if (!this.isLoggedIn) {
      return;
    }

    this.store$.dispatch(new hyp3Store.LoadJobs());
    this.store$.dispatch(new hyp3Store.LoadUser());

    this.dialog.open(ProcessingQueueComponent, {
      id: 'dlQueueDialog',
      maxWidth: '100vw',
      maxHeight: '100vh'
    });
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(window.location.href);
  }

  public onShareWithEmail() {
    const subject = `New Search - ${encodeURIComponent(document.title)}`;

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
