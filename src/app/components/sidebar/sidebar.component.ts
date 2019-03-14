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
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as searchStore from '@store/search';

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

  public granules$ = this.store$.select(granulesStore.getGranules).pipe(
    tap(granules => {
      if (granules.length > 0) {
        this.selectedTab = 1;
      }
    })
  );

  public loading$ = this.store$.select(searchStore.getIsLoading);
  public searchError$ = this.store$.select(searchStore.getSearchError);

  public filterType = models.FilterType;
  public selectedTab = 0;

  public searchTypes = models.SearchType;
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

  public onToggleHide(): void {
    this.store$.dispatch(new uiStore.ToggleSidebar());
  }

  public onNewSearch(): void {
    this.newSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSearch.emit();
  }
}

