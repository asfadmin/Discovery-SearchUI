import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterType, SearchType } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as models from '@models';
import { SubSink } from 'subsink';
import { combineLatest } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v1';
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

  public saveFilterOn: boolean;


  private currentFilters: {name: string, id: string, searchType: SearchType, filters: FilterType}[] = [];

  public userFilters: {name: string, id: string, searchType: SearchType, filters: FilterType}[] = [];

  private currentFiltersBySearchType = {};

  public displayedFilter = [];

  public currentSearchType: SearchType;
  public newFilterName = '';

  private subs = new SubSink();

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).subscribe ( userFilters => {
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
      this.store$.select(searchStore.getSearchType).subscribe(searchtype => {
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

    this.subs.add(
      this.store$.select(uiStore.getIsSaveFilterOn).pipe(
        tap(saveSearchOn => this.saveFilterOn = saveSearchOn),
        delay(250)
      ).subscribe(
        _ => {
          if (this.saveFilterOn) {
            this.newFilterName = 'New Filter Preset';
            this.onSaveFilters();
            this.store$.dispatch(new uiStore.SetSaveFilterOn(false));
          }
        }
      )
    );

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public onSaveFilters() {
    this.store$.dispatch(new userStore.AddNewFiltersPreset({name: this.newFilterName, id: uuid() as string, filters: this.currentFiltersBySearchType[this.currentSearchType], searchType: this.currentSearchType}));
    this.newFilterName = '';
    this.store$.dispatch(new userStore.SaveFilters());
  }

  public isValidPresetName(name: string) {
    return name !== '' && !this.currentFilters.map(preset => preset.name).includes(name);
  }

  public filterBySearchType(filters: {name: string, searchType: SearchType, filters: FilterType}[]) {
    const output = filters.filter(preset => preset.searchType === this.currentSearchType);
    return output;
  }

  public getFilterParams(savedFilter: FilterType) {
    return Object.entries(savedFilter).map(vals => ({key: vals[0], value: vals[1]})).filter(vals => !!vals.value && vals.value != '');
    // return params;
  }

  public loadPreset(filterPreset: {name: string, id: string, searchType: SearchType, filters: FilterType}) {
    this.store$.dispatch(new userStore.LoadFiltersPreset(filterPreset.id));
  }

  public onClose() {
    this.store$.dispatch(new uiStore.CloseFiltersSidebar());
  }
}
