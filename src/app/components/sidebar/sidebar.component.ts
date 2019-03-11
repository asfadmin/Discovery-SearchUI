import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { DateExtremaService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as searchStore from '@store/search';
import * as queueStore from '@store/queue';

import * as models from '@models';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('changeMenuState', [
      state('shown', style({ transform: 'translateX(100%)'
      })),
      state('hidden',   style({
        transform: 'translateX(0%)'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ],
})
export class SidebarComponent implements OnInit {
  @Input() isLoading: boolean;

  @Output() newSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() openSpreadsheet = new EventEmitter<void>();

  public searchTypes = models.SearchType;
  public listSearchMode$ = this.store$.select(filtersStore.getListSearchMode);

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public selectedFilter$ = this.store$.select(uiStore.getSelectedFilter);

  public granules$ = this.store$.select(granulesStore.getGranules).pipe(
    tap(granules => {
      if (granules.length > 0) {
        this.selectedTab = 1;
      }
    })
  );

  public selectedGranule$ = this.store$.select(granulesStore.getSelectedGranule);
  public selectedProducts$ = this.store$.select(granulesStore.getSelectedGranuleProducts);
  public searchList$ = this.store$.select(granulesStore.getSearchList).pipe(
    map(list => list.join('\n'))
  );

  public loading$ = this.store$.select(searchStore.getIsLoading);
  public searchError$ = this.store$.select(searchStore.getSearchError);

  public queueProducts$ = this.store$.select(queueStore.getQueuedProducts);

  public filterType = models.FilterType;
  public selectedTab = 0;

  public searchType$ = this.store$.select(uiStore.getSearchType);
  public selectedSearchType: models.SearchType;

  constructor(
    private dateExtremaService: DateExtremaService,
    private router: Router,
    private store$: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.searchType$.subscribe(
      searchType => this.selectedSearchType = searchType
    );
  }

  public onTabChange(tabIndex: number): void {
    this.selectedTab = tabIndex;
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }

  public onAppReset() {
    this.router.navigate(['/'], { queryParams: {} }) ;
    window.location.reload();
  }

  public onOpenSpreadsheet(): void {
    this.openSpreadsheet.emit();
  }

  public onNewFilterSelected(selectedFilter: models.FilterType): void {
    this.store$.dispatch(new uiStore.SetSelectedFilter(selectedFilter));
  }

  public onToggleHide(): void {
    this.store$.dispatch(new uiStore.ToggleSidebar());
  }

  public onNewSearch(): void {
    this.newSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSearch.emit();
  }

  public onNewGranuleSelected(name: string): void {
    this.store$.dispatch(new granulesStore.SetSelectedGranule(name));
  }

  public onNewGranuleList(searchList: string[]): void {
    this.store$.dispatch(new granulesStore.SetSearchList(searchList));
  }

  public onNewListSearchMode(mode: models.ListSearchType): void {
    this.store$.dispatch(new filtersStore.SetListSearchType(mode));
  }

  public onNewQueueItem(product: models.Sentinel1Product): void {
    this.store$.dispatch(new queueStore.AddItem(product));
  }

  public onNewQueueItems(products: models.Sentinel1Product[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onQueueGranuleProducts(name: string): void {
    this.store$.dispatch(new queueStore.QueueGranule(name));
  }

  public onNewFocusedGranule(granule: models.Sentinel1Product): void {
    this.store$.dispatch(new granulesStore.SetFocusedGranule(granule));
  }

  public onClearFocusedGranule(): void {
    this.store$.dispatch(new granulesStore.ClearFocusedGranule());
  }
}

