import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { GeographicFiltersType, SearchType } from '@models';
import * as models from '@models';
import { ScreenSizeService } from '@services';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as userStore from '@store/user';

import { SaveUserFilterComponent } from './save-user-filter/save-user-filter.component';

@Component({
  selector: 'app-save-user-filters',
  templateUrl: './save-user-filters.component.html',
  styleUrls: ['./save-user-filters.component.scss'],
  imports: [NgClass, SaveUserFilterComponent, MatButton, TranslateModule],
})
export class SaveUserFiltersComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  // private saveFilterOn = false;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public SearchType = models.SearchType;

  public saveFilterOn: boolean;

  public userFilters: models.SavedFilterPreset[] = [];

  public displayedFilter = [];

  public currentSearchType: SearchType;
  public newFilterName = '';
  public newSearchId = '';

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        (breakpoint) => (this.breakpoint = breakpoint),
      ),
    );

    this.subs.add(
      this.store$
        .select(userStore.getSavedFilters)
        .pipe(
          map((presets) =>
            presets.map((preset) =>
              preset.searchType === this.SearchType.DATASET
                ? {
                    ...preset,
                    filters: {
                      ...preset.filters,
                      flightDirections: Array.from(
                        (preset.filters as GeographicFiltersType)
                          .flightDirections,
                      ),
                    },
                  }
                : preset,
            ),
          ),
        )
        .subscribe((userFilters) => {
          this.userFilters = userFilters;
          const output = this.filterBySearchType(this.userFilters);
          this.displayedFilter = output.reverse();
        }),
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe((searchtype) => {
        this.currentSearchType = searchtype;
        const output = this.filterBySearchType(this.userFilters);
        this.displayedFilter = output.reverse();
      }),
    );
  }

  public filterBySearchType(filters: models.SavedFilterPreset[]) {
    let output = filters.filter(
      (preset) => preset.searchType === this.currentSearchType,
    );
    if (this.searchType() === SearchType.DATASET) {
      output = output.map((preset) => ({
        ...preset,
        filters: {
          ...preset.filters,
          flightDirections: Array.from(
            (preset.filters as GeographicFiltersType).flightDirections,
          ),
        },
      }));
    }
    return output;
  }

  public updatedSearchName(id: string) {
    if (id === this.newSearchId) {
      this.newSearchId = '';
    }
  }

  public onClose() {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
