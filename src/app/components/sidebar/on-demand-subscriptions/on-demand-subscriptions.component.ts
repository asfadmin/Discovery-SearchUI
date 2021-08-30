import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';
import * as searchStore from '@store/search';

import { CreateSubscriptionComponent } from '@components/header/create-subscription';
import { ScreenSizeService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-on-demand-subscriptions',
  templateUrl: './on-demand-subscriptions.component.html',
  styleUrls: [
    './on-demand-subscriptions.component.scss',
    '../save-user-filters/save-user-filters.component.scss',
    '../saved-searches/saved-searches.component.scss',
  ]
})
export class OnDemandSubscriptionsComponent implements OnInit, OnDestroy {
  public subscriptions = [];

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchType: models.SearchType;
  public SearchType = models.SearchType;

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.store$.select(hyp3Store.getOnDemandSubscritpions).subscribe(
        subs => this.subscriptions = subs
      )
    );

    this.subs.add(
      this.searchType$.subscribe(searchType => {
        this.searchType = searchType;
      })
    );
  }

  public onCreateSubscription() {
    this.dialog.open(CreateSubscriptionComponent, {
      id: 'subscriptionQueueDialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }

  public onClose() {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
