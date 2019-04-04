import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { interval, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, delay, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { ClipboardService } from 'ngx-clipboard';

import { AppState } from '@store';
import * as queueStore from '@store/queue';
import { Sentinel1Product, ViewType } from '@models';
import { environment } from '@environments/environment';
import { DatapoolAuthService } from '@services';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';

  @Output() openQueue = new EventEmitter<void>();

  @Input() products: Sentinel1Product[];

  constructor(
    public datapoolAuthService: DatapoolAuthService,
    public clipboard: ClipboardService,
  ) {}

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onAccountButtonClicked() {
    if (!this.datapoolAuthService.isLoggedIn) {
      this.datapoolAuthService.login();
    } else {
      this.datapoolAuthService.profileInfo()
        .subscribe(console.log);
      console.log('user is logged in...');
    }
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
