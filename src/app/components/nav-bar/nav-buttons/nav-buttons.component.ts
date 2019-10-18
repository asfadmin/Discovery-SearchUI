import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';

import { DatapoolAuthService, AsfApiService, EnvironmentService, ScreenSizeService } from '@services';
import { CMRProduct, Breakpoints } from '@models';

@Component({
  selector: 'app-nav-buttons',
  templateUrl: './nav-buttons.component.html',
  styleUrls: ['./nav-buttons.component.scss']
})
export class NavButtonsComponent implements OnInit {
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';
  public maturity = 'prod';
  private maturityKey = 'search-api-maturity';

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  @Input() queuedProducts: CMRProduct[];

  @Output() openQueue = new EventEmitter<void>();

  constructor(
    public datapoolAuthService: DatapoolAuthService,
    public env: EnvironmentService,
    public asfApiService: AsfApiService,
    public clipboard: ClipboardService,
    private screenSize: ScreenSizeService
  ) {}

  ngOnInit() {
    if (this.isDevMode) {
      const maturity = localStorage.getItem(this.maturityKey);
      this.setMaturity(maturity || this.maturity);
    }
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onAccountButtonClicked() {
    this.datapoolAuthService.login();
  }

  public onLogout(): void {
    this.datapoolAuthService.logout();
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
  }
}
