import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';

import { DatapoolAuthService, AsfApiService } from '@services';
import { CMRProduct } from '@models';

@Component({
  selector: 'app-nav-buttons',
  templateUrl: './nav-buttons.component.html',
  styleUrls: ['./nav-buttons.component.css']
})
export class NavButtonsComponent {
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';

  @Input() products: CMRProduct[];

  @Output() openQueue = new EventEmitter<void>();

  constructor(
    public datapoolAuthService: DatapoolAuthService,
    public asfApiService: AsfApiService,
    public clipboard: ClipboardService,
  ) {}

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
    return !!window['_env'].devMode;
  }

  public onTestSelected(): void {
    this.asfApiService.setApiUrl(this.asfApiService.apiUrls.test);
  }

  public onProdSelected(): void {
    this.asfApiService.setApiUrl(this.asfApiService.apiUrls.prod);
  }
}
