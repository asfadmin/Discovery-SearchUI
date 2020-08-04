import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import { SubSink } from 'subsink';

import { SearchType } from '@models';

enum MobileViews {
  LIST = 0,
  DETAIL = 1,
  CHART = 2,
  SBAS
}

@Component({
  selector: 'app-mobile-results-menu',
  templateUrl: './mobile-results-menu.component.html',
  styleUrls: ['./mobile-results-menu.component.scss', '../results-menu.component.scss']
})
export class MobileResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;

  public view = MobileViews.LIST;
  public Views = MobileViews;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public searchType: SearchType;
  public SearchTypes = SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
  }

  public onSelectList(): void {
    this.view = MobileViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = MobileViews.DETAIL;
  }

  public onSelectChart(): void {
    this.view = MobileViews.CHART;
  }

  public onSelectSBASChart(): void {
    this.view = MobileViews.SBAS;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
