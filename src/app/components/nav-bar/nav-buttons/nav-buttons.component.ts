import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';

import { DatapoolAuthService } from '@services';
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
    public clipboard: ClipboardService,
  ) {}

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onAccountButtonClicked() {
    this.datapoolAuthService.login();
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
}
