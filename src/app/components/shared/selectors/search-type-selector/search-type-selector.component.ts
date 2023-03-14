import {Component, OnInit, OnDestroy, ViewChild, Input, ElementRef} from '@angular/core';
import { SubSink } from 'subsink';

import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';

import * as models from '@models';

import { ScreenSizeService } from '@services';
import { AnalyticsEvent, Breakpoints, derivedDatasets } from '@models';
import { TranslateService } from "@ngx-translate/core";

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
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(MatMenu) searchMenu: MatMenu;
  @ViewChild('firstItem') firstItem: ElementRef;
  @Input() selected: string;
  param = {value: ' world'};


  public searchType: models.SearchType = models.SearchType.DATASET;
  public datasets = derivedDatasets;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public isLoggedIn = false;
  public searchTypes = models.SearchType;
  private subs = new SubSink();
  public isReadMore = true;

  constructor(
    public translate: TranslateService,
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  )
  {}

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

    SearchTypeSelectorComponent.openNewWindow(dataset_url, analyticsEvent);
  }

  private static openNewWindow(url, analyticsEvent: AnalyticsEvent): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': analyticsEvent.name,
      'open-derived-dataset': analyticsEvent.value
    });

    window.open(url, '_blank');
  }

  public onOpenDocs(event) {
    this.trigger.closeMenu();
    event.stopPropagation();
  }

  public onSearchTypeMenuOpen() {
    const panelId = this.searchMenu.panelId;
    document.getElementById(panelId).focus();
    setTimeout(() => {
      this.searchMenu.focusFirstItem();
      this.searchMenu.resetActiveItem();
      document.getElementById('firstItem').focus();
      document.getElementById(panelId).focus();
    }, 10);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


}
