import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';

import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import {
  MapLayerTypes,
  UserAuth,
  ProductType,
  datasetList,
  SearchType,
  SavedFilterPreset,
  FilterType,
  Breakpoints,
} from '@models';
import { Hyp3ApiService, ThemingService } from '@services';
import { SubSink } from 'subsink';
import { take } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AsfLanguageService } from '@services/asf-language.service';
import * as models from '@models';
import * as services from '@services';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { UpperCasePipe, TitleCasePipe } from '@angular/common';
import { DatasetSelectorComponent } from '@components/shared/selectors/dataset-selector/dataset-selector.component';
import { Hyp3UrlSelectorComponent } from './hyp3-url-selector/hyp3-url-selector.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  imports: [
    MatDialogTitle,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,

    MatOption,
    DatasetSelectorComponent,
    Hyp3UrlSelectorComponent,
    MatDialogActions,
    MatButton,
    UpperCasePipe,
    TitleCasePipe,
    TranslateModule,
  ],
})
export class PreferencesComponent implements OnInit, OnDestroy {
  private dialogRef = inject<MatDialogRef<PreferencesComponent>>(MatDialogRef);
  private store$ = inject<Store<AppState>>(Store);
  private hyp3 = inject(Hyp3ApiService);
  env = inject(services.EnvironmentService);
  private themeService = inject(ThemingService);
  translate = inject(TranslateService);
  language = inject(AsfLanguageService);
  private screenSize = inject(services.ScreenSizeService);

  @Output() selectedChange = new EventEmitter<string>();

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public datasets = datasetList;
  public defaultMaxResults: number;
  public defaultMapLayer: MapLayerTypes;
  public defaultDataset: string;
  public defaultMaxConcurrentDownloads: number;
  public defaultProductTypes: ProductType[];
  public hyp3BackendUrl: string;
  public hyp3SavedUrls: string[];
  public hyp3DebugStatus: string;
  public defaultLanguage: string;

  public maxResults = [250, 1000, 5000];
  public mapLayerTypes = MapLayerTypes;

  public userAuth: UserAuth;

  public searchType = SearchType;
  public searchTypeKeys = Object.keys(this.searchType).filter(
    (val) => val !== 'LIST' && val !== 'CUSTOM_PRODUCTS',
  );
  public selectedSearchType = SearchType.DATASET;

  public themeOptions: string[] = ['light', 'dark', 'System Preferences'];
  public themeTranslation: Record<string, string> = {
    light: 'LIGHT',
    dark: 'DARK',
    'System Preferences': 'SYSTEM_PREFERENCES',
  };
  public userFiltersBySearchType = {};
  public userFilters: SavedFilterPreset[];
  public selectedFiltersIDs = {
    'Baseline Search': '',
    'Geographic Search': '',
    'SBAS Search': '',
    Displacement: '',
  };
  public currentTheme = 'light';
  public currentFilterDisplayNames = {};

  private subs = new SubSink();

  ngOnInit() {
    this.screenSize.breakpoint$.subscribe(
      (breakpoint) => (this.breakpoint = breakpoint),
    );

    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe((profile) => {
        this.defaultLanguage = profile.language;
        this.defaultMaxResults = +profile.maxResults;
        this.defaultMapLayer = profile.mapLayer;
        this.defaultDataset = profile.defaultDataset;
        this.selectedFiltersIDs = profile.defaultFilterPresets;
        this.defaultMaxConcurrentDownloads =
          profile.defaultMaxConcurrentDownloads;
        this.hyp3BackendUrl = profile.hyp3BackendUrl;
        this.hyp3SavedUrls = profile.hyp3SavedUrls;
        this.currentTheme = profile.theme;
        this.defaultLanguage = profile.language;

        if (this.hyp3BackendUrl && !this.hyp3.apiUrl.includes('plus')) {
          this.hyp3.setApiUrl(this.hyp3BackendUrl);
        } else if (!this.hyp3.apiUrl.includes('plus')) {
          this.hyp3BackendUrl = this.hyp3.apiUrl;
        }

        if (!this.hyp3SavedUrls) {
          this.hyp3SavedUrls = [this.hyp3BackendUrl];
        }
      }),
    );

    this.subs.add(
      this.store$
        .select(userStore.getUserAuth)
        .subscribe((user) => (this.userAuth = user)),
    );

    this.subs.add(
      this.store$
        .select(userStore.getSavedFilters)
        .subscribe((savedFilters) => {
          this.userFilters = savedFilters;

          for (const searchtype in SearchType) {
            if (searchtype !== 'LIST' && searchtype !== 'CUSTOM_PRODUCTS') {
              const defaultPreset: SavedFilterPreset = {
                filters: {} as FilterType,
                id: '',
                name: 'Default',
                searchType: searchtype[searchtype],
              };
              this.userFiltersBySearchType[SearchType[searchtype]] = [
                defaultPreset,
              ];
            }
          }

          savedFilters.forEach((preset) =>
            this.userFiltersBySearchType[preset.searchType]?.push(preset),
          );

          const searchTypeKeys = Object.keys(this.selectedFiltersIDs);
          searchTypeKeys.forEach(
            (key) =>
              (this.currentFilterDisplayNames[key] = this.userFilters.find(
                (preset) => preset.id === this.selectedFiltersIDs[key],
              )?.id),
          );
        }),
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
    this.language.setCurrent(language);
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
      ...this.selectedFiltersIDs,
      [key]: filterID,
    };

    this.saveProfile();
  }

  public onChangeDefaultTheme(theme: string) {
    this.currentTheme = theme;

    if (theme === 'System Preferences') {
      this.themeService.theme$.pipe(take(1)).subscribe((currentPreference) => {
        this.setTheme(`theme-${currentPreference}`);
      });
    } else {
      this.setTheme(`theme-${this.currentTheme}`);
    }
  }
  public onDebugStatus(status: models.ApplicationStatus) {
    this.hyp3DebugStatus = status;
    this.store$.dispatch(new hyp3Store.SetDebugStatus(status));
  }

  public setTheme(themeName: string) {
    this.themeService.setTheme(themeName);
    this.saveProfile();
  }

  public onSetHyp3Url(event: { backendUrl: string; savedUrls: string[] }) {
    this.hyp3.setApiUrl(event.backendUrl);

    this.hyp3BackendUrl = this.hyp3.apiUrl;
    this.hyp3SavedUrls = event.savedUrls;

    this.saveProfile();
  }

  public saveProfile(): void {
    const action = new userStore.SetProfile({
      maxResults: this.defaultMaxResults,
      mapLayer: this.defaultMapLayer,
      defaultDataset: this.defaultDataset,
      defaultMaxConcurrentDownloads: this.defaultMaxConcurrentDownloads,
      defaultFilterPresets: this.selectedFiltersIDs,
      hyp3BackendUrl: this.hyp3BackendUrl,
      hyp3SavedUrls: this.hyp3SavedUrls,
      theme: this.currentTheme,
      language: this.defaultLanguage,
    });

    this.store$.dispatch(action);
  }

  onCloseDownloadQueue() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected readonly Breakpoints = Breakpoints;
}
