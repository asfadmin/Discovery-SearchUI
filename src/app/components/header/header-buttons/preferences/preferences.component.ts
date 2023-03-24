import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';

import { MatDialogRef } from '@angular/material/dialog';
import {
  MapLayerTypes, UserAuth, ProductType,
  datasetList, SearchType, SavedFilterPreset, FilterType
} from '@models';
import { Hyp3Service, ThemingService } from '@services';
import { SubSink } from 'subsink';
import { take } from 'rxjs';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  public datasets = datasetList;
  public defaultMaxResults: number;
  public defaultMapLayer: MapLayerTypes;
  public defaultDataset: string;
  public defaultMaxConcurrentDownloads: number;
  public defaultProductTypes: ProductType[];
  public hyp3BackendUrl: string;
  public defaultLanguage: string;

  public defaultGeoSearchFiltersID;
  public defaultBaselineSearchFiltersID;
  public defaultSBASSearchFiltersID;

  public maxResults = [250, 1000, 5000];
  public mapLayerTypes = MapLayerTypes;

  public userAuth: UserAuth;

  public searchType = SearchType;
  public searchTypeKeys = Object.keys(this.searchType).filter(val => val !== 'LIST' && val !== 'CUSTOM_PRODUCTS');
  public selectedSearchType = SearchType.DATASET;


  public themeOptions: string[] = ['light', 'dark', 'System Preferences'];
  public userFiltersBySearchType = {};
  public userFilters: SavedFilterPreset[];
  public selectedFiltersIDs = {
    'Baseline Search': '',
    'Geographic Search': '',
    'SBAS Search': ''
  };
  public currentTheme = 'light';
  public currentFilterDisplayNames = {};

  private subs = new SubSink();

  constructor(
    private dialogRef: MatDialogRef<PreferencesComponent>,
    private store$: Store<AppState>,
    private hyp3: Hyp3Service,
    private themeService: ThemingService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe(
        profile => {
          this.defaultLanguage = profile.language;
          this.defaultMaxResults = profile.maxResults;
          this.defaultMapLayer = profile.mapLayer;
          this.defaultDataset = profile.defaultDataset;
          this.selectedFiltersIDs = profile.defaultFilterPresets;
          this.defaultMaxConcurrentDownloads = profile.defaultMaxConcurrentDownloads;
          this.hyp3BackendUrl = profile.hyp3BackendUrl;
          this.currentTheme = profile.theme;
          this.defaultLanguage = profile.language;
          if (this.hyp3BackendUrl) {
            this.hyp3.setApiUrl(this.hyp3BackendUrl);
          } else {
            this.hyp3BackendUrl = this.hyp3.apiUrl;
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserAuth).subscribe(
        user => this.userAuth = user
      )
    );

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).subscribe(savedFilters => {
        this.userFilters = savedFilters;

        for (const searchtype in SearchType) {
          if (searchtype !== 'LIST' && searchtype !== 'CUSTOM_PRODUCTS') {
            const defaultPreset: SavedFilterPreset = {
              filters: {} as FilterType,
              id: '',
              name: 'Default',
              searchType: searchtype[searchtype]
            };

            this.userFiltersBySearchType[SearchType[searchtype]] = [defaultPreset];
          }
        }

        savedFilters.forEach(
          preset => this.userFiltersBySearchType[preset.searchType]?.push(preset)
        );

        const searchTypeKeys = Object.keys(this.selectedFiltersIDs);
        searchTypeKeys.forEach(key =>
          this.currentFilterDisplayNames[key] = this.userFilters.find(preset => preset.id === this.selectedFiltersIDs[key])?.id
        );
      }
      )
    );

  }

  public onClose(): void {
    this.saveProfile();
    this.dialogRef.close();
  }

  public onDatasetSelectionChange(dataset: string): void {
    this.defaultDataset = dataset;
    this.saveProfile();
  }

  public onChangeMaxResultsDefault(maxResults: number): void {
    this.defaultMaxResults = maxResults;
    this.saveProfile();
  }

  public onChangeDefaultLayerType(layerType: MapLayerTypes): void {
    this.defaultMapLayer = layerType;
    this.saveProfile();
  }

  public onChangeDefaultLanguage(language: string): void {
    this.defaultLanguage = language;
    this.saveProfile();
  }

  public onChangeDefaultMaxConcurrentDownloads(maxDownloads: number): void {
    this.defaultMaxConcurrentDownloads = maxDownloads;
    this.saveProfile();
  }

  public onChangeDefaultFilterType(filterID: string, searchType: string): void {
    const key = SearchType[searchType];
    this.selectedFiltersIDs = {
      ... this.selectedFiltersIDs,
      [key]: filterID
    };

    this.saveProfile();
  }

  public onChangeDefaultTheme(theme: string) {
    this.currentTheme = theme;

    if (theme === 'System Preferences') {
      this.themeService.theme$.pipe(
        take(1)
      ).subscribe(currentPreference => {
        this.setTheme(`theme-${currentPreference}`);
      });
    } else {
      this.setTheme(`theme-${this.currentTheme}`);
    }
  }

  public setTheme(themeName: string) {
    this.themeService.setTheme(themeName);
    this.saveProfile()
  }

  public resetHyp3Url() {
    this.hyp3.setDefaultApiUrl();
    this.hyp3BackendUrl = this.hyp3.apiUrl;
  }

  public saveProfile(): void {
    const action = new userStore.SetProfile({
      maxResults: this.defaultMaxResults,
      mapLayer: this.defaultMapLayer,
      defaultDataset: this.defaultDataset,
      defaultMaxConcurrentDownloads: this.defaultMaxConcurrentDownloads,
      defaultFilterPresets: this.selectedFiltersIDs,
      hyp3BackendUrl: this.hyp3BackendUrl,
      theme: this.currentTheme,
      language: this.defaultLanguage
    });

    this.store$.dispatch(action);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
