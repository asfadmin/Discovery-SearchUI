import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { combineLatest } from 'rxjs';
import { withLatestFrom, switchMap, map, filter, delay } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as userActions from './user.action';
import * as userReducer from './user.reducer';
import * as hyp3Store from '../hyp3/hyp3.action';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';
import { UserDataService } from '@services/user-data.service';
import * as models from '@models';
import { BaselineFiltersType, FilterType, GeographicFiltersType, SbasFiltersType, SearchType } from '@models';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private userDataService: UserDataService,
  ) {}

  public saveUserProfile = createEffect(() => this.actions$.pipe(
    ofType<userActions.SaveProfile>(userActions.UserActionType.SAVE_PROFILE),
    withLatestFrom(
      combineLatest(
        this.store$.select(userReducer.getUserAuth),
        this.store$.select(userReducer.getUserProfile)
      )
    ),
    switchMap(
      ([_, [userAuth, profile]]) =>
        this.userDataService.setAttribute$(userAuth, 'Profile', profile)
    )
  ), { dispatch: false });

  public loadLoadUserProfile = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_PROFILE),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'Profile')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    filter(resp => this.isValidProfile(resp)),
    map(profile => new userActions.SetProfile(<models.UserProfile>profile))
  ));

  public saveSavedSearches = createEffect(() => this.actions$.pipe(
    ofType<userActions.SaveSearches>(userActions.UserActionType.SAVE_SEARCHES),
    withLatestFrom(
      combineLatest(
        this.store$.select(userReducer.getUserAuth),
        this.store$.select(userReducer.getSavedSearches)
      )
    ),
    switchMap(
      ([_, [userAuth, searches]]) =>
        this.userDataService.setAttribute$(userAuth, 'SavedSearches', searches)
    ),
  ), { dispatch: false });

  public saveSavedFilters = createEffect(() => this.actions$.pipe(
    ofType<userActions.SaveFilters>(userActions.UserActionType.SAVE_FILTERS),
    withLatestFrom(
      combineLatest(
        this.store$.select(userReducer.getUserAuth),
        this.store$.select(userReducer.getSavedFilters)
      )
    ),
    switchMap(
      ([_, [userAuth, filtersPresets]]) =>
        this.userDataService.setAttribute$(userAuth, 'SavedFilters', filtersPresets)
    ),
  ), { dispatch: false });

  public saveSearchHistory = createEffect(() => this.actions$.pipe(
    ofType<userActions.SaveSearches>(userActions.UserActionType.SAVE_SEARCH_HISTORY),
    withLatestFrom(
      combineLatest(
        this.store$.select(userReducer.getUserAuth),
        this.store$.select(userReducer.getSearchHistory)
      )
    ),
    switchMap(
      ([_, [userAuth, searches]]) =>
        this.userDataService.setAttribute$(userAuth, 'History', searches)
    ),
  ), { dispatch: false });

  public loadSearchHistory = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_SEARCH_HISTORY),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searchHistory => new userActions.SetSearchHistory(<models.Search[]>searchHistory))
  ));

  public loadSearchHistoryOnLogin = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOGIN),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'History')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searchHistory => new userActions.SetSearchHistory(<models.Search[]>searchHistory))
  ));

  public loadSavedSearchesOnLogin = createEffect(() => this.actions$.pipe(
    ofType<userActions.Login>(userActions.UserActionType.LOGIN),
    switchMap(
      (action) =>
        this.userDataService.getAttribute$(action.payload, 'SavedSearches')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searches => this.datesToDateObjectFor(searches) as models.Search[]),
    map(searches => new userActions.SetSearches(<models.Search[]>searches))
  ));

  public loadSavedFiltersOnLogin = createEffect(() => this.actions$.pipe(
    ofType<userActions.Login>(userActions.UserActionType.LOGIN),
    switchMap(
      (action) =>
        this.userDataService.getAttribute$(action.payload, 'SavedFilters')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(filters => this.datesToDateObjectFor(filters) as {name: string, id: string, searchType: SearchType, filters: FilterType}[]),
    map(Filterpresets => new userActions.SetFilters(<{name: string, id: string, searchType: SearchType, filters: FilterType}[]>Filterpresets))
  ));

  public loadHyp3UserOnLogin = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOGIN),
    delay(400),
    map(_ => new hyp3Store.LoadUser())
  ));

  public loadSavedSearches = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedSearches>(userActions.UserActionType.LOAD_SAVED_SEARCHES),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'SavedSearches')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(searches => this.datesToDateObjectFor(searches) as models.Search[]),
    map(searches => new userActions.SetSearches(<models.Search[]>searches))
  ));

  public loadSavedFiltersPresets = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadSavedFilters>(userActions.UserActionType.LOAD_SAVED_FILTERS),
    withLatestFrom( this.store$.select(userReducer.getUserAuth)),
    switchMap(
      ([_, userAuth]) =>
        this.userDataService.getAttribute$(userAuth, 'SavedFilters')
    ),
    filter(resp => this.isSuccessfulResponse(resp)),
    map(filtersPresets => this.datesToDateObjectFor(filtersPresets) as {name: string, id: string, searchType: SearchType, filters: FilterType}[]),
    map(filtersPresets => new userActions.SetFilters(<{name: string, id: string, searchType: SearchType, filters: FilterType}[]>filtersPresets))
  ));

  public loadSavedFiltersOfSearchType = createEffect(() => this.actions$.pipe(
    ofType<userActions.LoadFiltersPreset>(userActions.UserActionType.LOAD_FILTERS_PRESET),
    withLatestFrom(this.store$.select(searchStore.getSearchType)),
    filter(([_, searchtype]) => searchtype !== SearchType.LIST && searchtype !== SearchType.CUSTOM_PRODUCTS),
    withLatestFrom(this.store$.select(userReducer.getSavedFilters)),
    map(([[action, searchType], userFilters]) => {
      const targetFilter = userFilters
        .filter(preset => preset.searchType === searchType)
        .find(preset => preset.id === action.payload);

      let actions = [];

      switch (searchType) {
        case SearchType.DATASET:
          this.store$.dispatch(new filterStore.ClearDatasetFilters());
          actions = this.setDatasetFilters(targetFilter.filters as GeographicFiltersType);
          break;
        case SearchType.BASELINE:
          this.store$.dispatch(new filterStore.ClearPerpendicularRange());
          this.store$.dispatch(new filterStore.ClearTemporalRange());
          actions = this.setBaselineFilters(targetFilter.filters as BaselineFiltersType);
          break;
        case SearchType.SBAS:
          this.store$.dispatch(new filterStore.ClearPerpendicularRange());
          this.store$.dispatch(new filterStore.ClearTemporalRange());
          actions = this.setSBASFilters(targetFilter.filters as SbasFiltersType);
          break;
        default:
          break;
      }

      actions.forEach(action => this.store$.dispatch(action));
    })
  ), {dispatch: false});

  private isSuccessfulResponse(resp): boolean {
    try {
      return !(
        !!resp &&
        'status' in resp &&
        resp['status'] === 'fail'
      );
    } catch {
      return false;
    }
  }

  private datesToDateObjectFor(searches): models.Search[] | {name: string, id: string, searchType: SearchType, filter: FilterType}[] {
    return searches.map(search => {
      if (search.searchType === models.SearchType.LIST || !search.filters.dateRange) {
        return search;
      }

      const { start, end } = search.filters.dateRange;

      search.filters.dateRange = {
        start: this.loadIfDate(start),
        end: this.loadIfDate(end)
      };

      return search;
    });

    return [];
  }

  private loadIfDate(date: string | null): Date | null {
    if (date === null) {
      return null;
    }

    const dateObj = new Date(date);

    return this.isValidDate(dateObj) ? dateObj : null;
  }

  private isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.valueOf());

  private isValidProfile(resp) {
    const datasetIds = models.datasetIds;

    return (
      datasetIds.includes(resp.defaultDataset) &&
      Object.values(models.MapLayerTypes).includes(resp.mapLayer) &&
      this.isNumber(resp.maxResults) && resp.maxResults <= 5000
    );
  }

  private isNumber = n => !isNaN(n) && isFinite(n);

  private setDatasetFilters(datasetFilter: GeographicFiltersType) {
    const actions = [
      new filterStore.SetSelectedDataset(datasetFilter.selectedDataset),
      new filterStore.SetStartDate(datasetFilter.dateRange.start),
      new filterStore.SetEndDate(datasetFilter.dateRange.end),
      new filterStore.SetSeasonStart(datasetFilter.season.start),
      new filterStore.SetSeasonEnd(datasetFilter.season.end),
      new filterStore.SetPathStart(datasetFilter.pathRange.start),
      new filterStore.SetPathEnd(datasetFilter.pathRange.end),
      new filterStore.SetFrameStart(datasetFilter.frameRange.start),
      new filterStore.SetFrameEnd(datasetFilter.frameRange.end),

      new filterStore.SetProductTypes(datasetFilter.productTypes),
      new filterStore.SetBeamModes(datasetFilter.beamModes),
      new filterStore.SetPolarizations(datasetFilter.polarizations),
      new filterStore.SetSubtypes(datasetFilter.subtypes),
      new filterStore.SetFlightDirections(datasetFilter.flightDirections),
      new filterStore.SelectMission(datasetFilter.selectedMission)
    ]

    return actions;
  }

  private setBaselineFilters(baselineFilter: BaselineFiltersType) {
    const actions = [
      new filterStore.SetStartDate(baselineFilter.dateRange.start),
      new filterStore.SetEndDate(baselineFilter.dateRange.end),
      new filterStore.SetSeasonStart(baselineFilter.season.start),
      new filterStore.SetSeasonEnd(baselineFilter.season.end),
      new filterStore.SetTemporalRange(baselineFilter.temporalRange),
      new filterStore.SetPerpendicularRange(baselineFilter.perpendicularRange)
    ];

    return actions;
  }

  private setSBASFilters(sbasFilter: SbasFiltersType) {
    const actions = [
      new filterStore.SetStartDate(sbasFilter.dateRange.start),
      new filterStore.SetEndDate(sbasFilter.dateRange.end),
      new filterStore.SetSeasonStart(sbasFilter.season.start),
      new filterStore.SetSeasonEnd(sbasFilter.season.end),
      new filterStore.SetTemporalEnd(sbasFilter.temporal),
      new filterStore.SetPerpendicularEnd(sbasFilter.perpendicular)
    ];

    return actions;
  }
}
