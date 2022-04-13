import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';


import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';

import * as models from '@models';

import { ScreenSizeService } from '@services';
import {AnalyticsEvent, Breakpoints, derivedDatasets} from '@models';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-search-type-selector',
  templateUrl: './search-type-selector.component.html',
  styleUrls: ['./search-type-selector.component.scss']
})
export class SearchTypeSelectorComponent implements OnInit, OnDestroy {
  public searchType: models.SearchType = models.SearchType.DATASET;
  public asfWebsiteUrl = 'https://www.asf.alaska.edu';
  public datasets = derivedDatasets;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public isLoggedIn = false;
  public searchTypes = models.SearchType;
  private subs = new SubSink();
  public isReadMore = true;

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );
  }

  public onSetSearchType(searchType: models.SearchType): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'search-type-selected',
      'search-type': searchType
    });
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }

  public onOpenDerivedDataset(dataset_url: string, dataset_name: string): void {

    const analyticsEvent = {
      name: 'open-derived-dataset',
      value: dataset_name
    };

    this.openNewWindow(dataset_url, analyticsEvent);
  }

  private openNewWindow(url, analyticsEvent: AnalyticsEvent): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': analyticsEvent.name,
      'open-derived-dataset': analyticsEvent.value
    });

    window.open(url, '_blank');
  }

  showText() {
    this.isReadMore = !this.isReadMore;
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
