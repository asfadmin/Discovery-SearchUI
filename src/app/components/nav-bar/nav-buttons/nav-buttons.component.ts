import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ClipboardService } from 'ngx-clipboard';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';
import { PreferencesComponent } from './preferences/preferences.component';
import { AuthService, AsfApiService, EnvironmentService, ScreenSizeService } from '@services';
import { CMRProduct, Breakpoints, UserAuth } from '@models';

@Component({
  selector: 'app-nav-buttons',
  templateUrl: './nav-buttons.component.html',
  styleUrls: ['./nav-buttons.component.scss']
})
export class NavButtonsComponent implements OnInit {
  anio: number = new Date().getFullYear();
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';
  public maturity = 'prod';
  private maturityKey = 'search-api-maturity';

  public userAuth: UserAuth;
  public isLoggedIn = false;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  @Input() queuedProducts: CMRProduct[];

  @Output() openQueue = new EventEmitter<void>();

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
    if (this.isDevMode) {
      const maturity = localStorage.getItem(this.maturityKey);
      this.setMaturity(maturity || this.maturity);
    }

    this.store$.select(userStore.getUserAuth).subscribe(
      user => this.userAuth = user
    );

    this.store$.select(userStore.getIsUserLoggedIn).subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onAccountButtonClicked() {
    this.authService.login$().subscribe(
      user => this.store$.dispatch(new userStore.Login(user))
    );
  }

  public onLogout(): void {
    this.authService.logout$().subscribe(
      user => this.store$.dispatch(new userStore.Logout())
    );
  }

  public onOpenPreferences(): void {
    const dialogRef = this.dialog.open(PreferencesComponent, {
      maxWidth: '100%',
      maxHeight: '100%'
    });

    dialogRef.afterClosed().subscribe(
      _ => this.store$.dispatch(new userStore.SaveProfile())
    );
  }

  public onOpenSavedSearches(): void {
    this.store$.dispatch(new uiStore.OpenSidebar());
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
    return !!this.env.value.devMode;
  }

  public onTestSelected(): void {
    this.setMaturity('test');
  }

  public onProdSelected(): void {
    this.setMaturity('prod');
  }

  private setMaturity(maturity: string): void {
    this.maturity = maturity;
    localStorage.setItem(this.maturityKey, this.maturity);
    this.asfApiService.setApiMaturity(this.maturity);
    this.authService.setMaturity(this.maturity);
  }
}
