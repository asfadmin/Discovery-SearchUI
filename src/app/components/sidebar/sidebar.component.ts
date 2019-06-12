import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';
import { map, tap, filter, switchMap, catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { DateExtremaService } from '@services';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';

import * as services from '@services';
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
  @Output() newSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);
  public isFiltersMenuOpen: boolean;

  public uiView$ = this.store$.select(uiStore.getUiView);
  public canSearch$ = this.store$.select(searchStore.getCanSearch);

  public currentSearchAmount$ = this.store$.select(searchStore.getSearchAmount);

  public isHidden = false;

  public granules$ = this.store$.select(granulesStore.getGranules);

  public loading$ = this.store$.select(searchStore.getIsLoading);
  public searchError$ = this.store$.select(searchStore.getSearchError);
  public maxResults$ = this.store$.select(filtersStore.getMaxSearchResults);

  public filterType = models.FilterType;

  public searchTypes = models.SearchType;
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public selectedSearchType: models.SearchType;

  constructor(
    public dialog: MatDialog,
    private dateExtremaService: DateExtremaService,
    private asfApiService: services.AsfApiService,
    private router: Router,
    private store$: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.searchType$.subscribe(
      searchType => this.selectedSearchType = searchType
    );

    this.store$.select(uiStore.getIsHidden).subscribe(
      isHidden => this.isHidden = isHidden
    );

    this.isFiltersMenuOpen$.subscribe(
      isOpen => this.isFiltersMenuOpen = isOpen
    );
  }

  public closePanel(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }

  public onAppReset() {
    this.router.navigate(['/'], { queryParams: {} }) ;
    window.location.reload();
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

  public onNewAppView(uiView: models.ViewType): void {
    this.store$.dispatch(new uiStore.SetUiView(uiView));
  }

  public onNewMaxSearchResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }
}

