import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';

import { SavedSearchService, ScreenSizeService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss']
})
export class CreateSubscriptionComponent implements OnInit, OnDestroy {
  public hyp3JobTypes = models.hyp3JobTypes;
  public hyp3JobTypesList: models.Hyp3JobType[];
  public selectedJobTypeId: string | null = models.hyp3JobTypes.RTC_GAMMA.id;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public search;

  private subs = new SubSink();

  constructor(
    private savedSearchService: SavedSearchService,
    private screenSize: ScreenSizeService,
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      combineLatest(
        this.savedSearchService.currentSearch$,
        this.store$.select(searchStore.getSearchType)
      )
      .subscribe(([search, searchType]) => {
        this.search = {
          filters: search,
          searchType
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
