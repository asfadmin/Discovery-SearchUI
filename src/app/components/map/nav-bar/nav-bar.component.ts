import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { interval, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, delay, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { ClipboardService } from 'ngx-clipboard';

import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as filtersStore from '@store/filters';

import { Sentinel1Product, ViewType } from '@models';
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

  @Input() products: Sentinel1Product[];
  @Input() isSideMenuOpen: boolean;
  @Input() showFilters: boolean;

  constructor(
    private store$: Store<AppState>,
    public datapoolAuthService: DatapoolAuthService,
    public clipboard: ClipboardService,
  ) {}

  // Platform Selector
  public platforms$ = this.store$.select(filtersStore.getPlatformsList);
  public selectedPlatformName$ = this.store$.select(filtersStore.getSelectedPlatformNames).pipe(
    map(platform => platform.size === 1 ?
      platform.values().next().value : null
    )
  );

  public onPlatformRemoved(platformName: string): void {
    this.store$.dispatch(new filtersStore.RemoveSelectedPlatform(platformName));
  }

  public onPlatformAdded(platformName: string): void {
    this.store$.dispatch(new filtersStore.AddSelectedPlatform(platformName));
  }

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
