import {Component, OnInit, OnDestroy, Input} from '@angular/core';

import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';
import * as filterStore from '@store/filters';

import { EnvironmentService, NotificationService, ScreenSizeService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';
import { Observable } from 'rxjs';
import { areFiltersChanged } from '@store/filters';
import { SBASOverlap } from '@models';

@Component({
  selector: 'app-filters-dropdown',
  templateUrl: './filters-dropdown.component.html',
  styleUrls: ['./filters-dropdown.component.scss'],
  animations: [
    trigger('isOpen', [
      state('true', style({transform: 'translateY(0%)'})),
      state('false', style({transform: 'translateY(-10000%)'})
      ),
      transition('true => false', animate('50ms ease-out')),
      transition('false => true', animate('50ms ease-in'))
    ])
  ],
})
export class FiltersDropdownComponent implements OnInit, OnDestroy {
  @Input() dataset$: Observable<models.CMRProduct>;
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);

  public searchType$ = this.store$.select(searchStore.getSearchType);
  private searchType;
  public searchTypes = models.SearchType;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  private areFiltersChanged;

  public subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private notificationService: NotificationService,
    private environmentService: EnvironmentService,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );
    this.subs.add(
      this.searchType$.subscribe(
        searchType => this.searchType = searchType
      )
    );
    this.subs.add(
      this.store$.select(areFiltersChanged).subscribe(
        filtersChanged => this.areFiltersChanged = filtersChanged
      )
    );

    if (this.environmentService.maturity === 'prod') {
      this.store$.dispatch(new filterStore.SetSBASOverlapThreshold(SBASOverlap.ALL));
    }
  }

  public closePanel(): void {
    if (this.searchType !== this.searchTypes.SBAS && this.searchType !== this.searchTypes.BASELINE && this.areFiltersChanged) {
      this.notificationService.closeFiltersPanel();
    }
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
