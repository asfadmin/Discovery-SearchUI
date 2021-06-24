import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterType, SearchType } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
// import * as uiStore from '@store/ui';
import * as models from '@models';
import { SubSink } from 'subsink';
import { combineLatest } from 'rxjs';
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
  public SearchType = models.SearchType;


  private currentFilters: {name: string, searchType: SearchType, filter: FilterType}[] = [];

  public userFilters: {name: string, searchType: SearchType, filter: FilterType}[] = [];

  private currentFiltersBySearchType = {};

  public displayedFilter = [];

  public currentSearchType: SearchType;
  public newFilterName = '';

  private subs = new SubSink();

  constructor(private store$: Store<AppState>){}

  ngOnInit(): void {

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).subscribe ( userFilters =>
        {
          this.userFilters = userFilters;
          const output = this.filterBySearchType(this.userFilters);
          this.displayedFilter = output;
        })
    );

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).subscribe(currentFilters => this.currentFilters = currentFilters)
    );
    // this.store$.select(filterStore.get)

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(searchtype =>
        {
          this.currentSearchType = searchtype;
          const output = this.filterBySearchType(this.userFilters);
          this.displayedFilter = output;
          // this.displayedFilter = this.filterBySearchType(this.userFilters);
        }
          )
    );

    this.subs.add(
      combineLatest(this.store$.select(filterStore.getGeographicSearch),
        this.store$.select(filterStore.getListSearch),
        this.store$.select(filterStore.getBaselineSearch),
        this.store$.select(filterStore.getSbasSearch))
        .subscribe(([geo, list, baseline, sbas]) => {
          this.currentFiltersBySearchType[SearchType.DATASET] = geo;
          this.currentFiltersBySearchType[SearchType.LIST] = list;
          this.currentFiltersBySearchType[SearchType.BASELINE] = baseline;
          this.currentFiltersBySearchType[SearchType.SBAS] = sbas;
        })
    );

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public onSaveFilters() {
    this.store$.dispatch(new userStore.AddNewFiltersPreset({name: this.newFilterName, filter: this.currentFiltersBySearchType[this.currentSearchType], searchType: this.currentSearchType}));
    this.newFilterName = '';
  }

  public isValidPresetName(name: string) {
    return name !== '' && !this.currentFilters.map(preset => preset.name).includes(name);
  }

  public filterBySearchType(filters: {name: string, searchType: SearchType, filter: FilterType}[]) {
    let output = filters.filter(preset => preset.searchType === this.currentSearchType);
    return output;
  }

  public getFilterParams(savedFilter: FilterType) {
    return Object.entries(savedFilter).map(vals => ({key: vals[0], value: vals[1]})).filter(vals => !!vals.value && vals.value != '');
    // return params;
  }

  public loadPreset(filterPreset: {name: string, searchType: SearchType, filter: FilterType}) {
    this.store$.dispatch(new userStore.LoadFiltersPreset(filterPreset.name));
  }

}
