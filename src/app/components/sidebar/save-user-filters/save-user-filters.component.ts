import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeographicFiltersType, SearchType } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as models from '@models';
import { SubSink } from 'subsink';
import { map } from 'rxjs/operators';
import { ScreenSizeService } from '@services';
@Component({
  selector: 'app-save-user-filters',
  templateUrl: './save-user-filters.component.html',
  styleUrls: ['./save-user-filters.component.scss']
})
export class SaveUserFiltersComponent implements OnInit, OnDestroy {
  // private saveFilterOn = false;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchType: models.SearchType;
  public SearchType = models.SearchType;

  public saveFilterOn: boolean;

  public userFilters: models.SavedFilterPreset[] = [];

  public displayedFilter = [];

  public currentSearchType: SearchType;
  public newFilterName = '';
  public newSearchId = '';

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).pipe(
        map(presets => presets.map(preset =>
          preset.searchType === this.SearchType.DATASET ?
            ({ ...preset,
                filters: {
                  ... preset.filters,
                  flightDirections: Array.from((preset.filters as GeographicFiltersType).flightDirections)
                }
            })
            : preset
          )
        )
      ).subscribe ( userFilters => {
          this.userFilters = userFilters;
          const output = this.filterBySearchType(this.userFilters);
          this.displayedFilter = output.reverse();
        })
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(searchtype => {
        this.currentSearchType = searchtype;
        const output = this.filterBySearchType(this.userFilters);
        this.displayedFilter = output.reverse();
      })
    );

    this.subs.add(
      this.searchType$.subscribe(searchType => {
        this.searchType = searchType;
      })
    );
  }

  public filterBySearchType(filters: models.SavedFilterPreset[]) {
    let output = filters.filter(preset => preset.searchType === this.currentSearchType);
    if (this.searchType === SearchType.DATASET) {
      output = output.map(preset => (
          { ...preset,
            filters: {
              ... preset.filters,
              flightDirections: Array.from((preset.filters as GeographicFiltersType).flightDirections)
            }
          }
        )
      );
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
