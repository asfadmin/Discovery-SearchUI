import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { ClipboardService } from 'ngx-clipboard';

import * as models from '@models';

import { DatapoolAuthService } from '@services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
    trigger('changeMenuX', [
      state('full-width', style({
        width: 'calc(100vw - 450px)'
      })),
      state('half-width',   style({
        width: '100vw'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ],
})
export class NavBarComponent {
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';

  @Output() openQueue = new EventEmitter<void>();
  @Output() doSearch = new EventEmitter<void>();

  @Input() products: models.Sentinel1Product[];
  @Input() isSideMenuOpen: boolean;

  constructor(
    public datapoolAuthService: DatapoolAuthService,
    public clipboard: ClipboardService,
  ) {}

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onDoSearch(): void {
    this.doSearch.emit();
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
