import { Component, OnInit } from '@angular/core';
import { FilterType, SearchType } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
import { filter, tap } from 'rxjs/operators';
// import { FiltersState } from '@store/filters';
// import { GeographicFiltersType, ListFiltersType, SbasFiltersType, BaselineFiltersType } from '@models';
import { SubSink } from 'subsink';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-save-user-filters',
  templateUrl: './save-user-filters.component.html',
  styleUrls: ['./save-user-filters.component.scss']
})
export class SaveUserFiltersComponent implements OnInit {

  private currentFilters: {name: string, searchType: SearchType, filter: FilterType}[] = [];

  public userFilters: {name: string, searchType: SearchType, filter: FilterType}[] = [];

  private currentFiltersBySearchType = {};

  public currentSearchType: SearchType;
  public newFilterName: string;

  private subs = new SubSink();

  constructor(private store$: Store<AppState>){}

  ngOnInit(): void {
    // this.store$.select(userStore.getSearchHistory).pipe(
    //   map(searches => searches[0])).subscribe(latest_search => this.currentSearch = latest_search)

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).pipe(
        filter(fitlerPresets => fitlerPresets.length > 0),
      ).subscribe ( userFilters => this.userFilters = userFilters)
    );

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).subscribe(currentFilters => this.currentFilters = currentFilters)
    );
    // this.store$.select(filterStore.get)

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(searchtype => this.currentSearchType = searchtype)
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

  public onSaveFilters() {
    // const currentFilterName = (this.currentFilters.length + 1).toString();
    if(this.newFilterName === undefined) {
      return;
    }
    if(this.newFilterName === '') {
      return;
    }
    if(this.currentFilters.map(preset => preset.name).includes(this.newFilterName)) {
      return;
    }
    this.store$.dispatch(new userStore.AddNewFiltersPreset({name: this.newFilterName, filter: this.currentFiltersBySearchType[this.currentSearchType], searchType: this.currentSearchType}));

    this.newFilterName = '';
    // this.userFilters.push((this.userFilters.length - 1).toString());
  }

  public filterBySearchType(filters: {name: string, searchType: SearchType, filter: FilterType}[]) {
    return filters.filter(preset => preset.searchType === this.currentSearchType);
  }

  public loadPreset(filterPreset: {name: string, searchType: SearchType, filter: FilterType}) {
    this.store$.dispatch(new userStore.LoadFiltersPreset(filterPreset.name));
  }

}
