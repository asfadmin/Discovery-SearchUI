import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';

import { MatDialogRef } from '@angular/material/dialog';
import { MapLayerTypes, UserAuth, ProductType, datasetList, SearchType } from '@models';
import { SubSink } from 'subsink';


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
  public defaultProductTypes: ProductType[];

  public defaultGeoSearchFiltersID;
  public defaultBaselineSearchFiltersID;
  public defaultSBASSearchFiltersID;

  public maxResults = [250, 1000, 5000];
  public mapLayerTypes = MapLayerTypes;

  public userAuth: UserAuth;

  public searchType = SearchType;
  public searchTypeKeys = Object.keys(this.searchType).filter(val => val !== 'LIST' && val !== 'CUSTOM_PRODUCTS')
  public selectedSearchType = SearchType.DATASET;

  public userFiltersBySearchType = {};
  public selectedFiltersIDs = {};

  private subs = new SubSink();

  constructor(
    private dialogRef: MatDialogRef<PreferencesComponent>,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe(
        profile => {
          this.defaultMaxResults = profile.maxResults;
          this.defaultMapLayer = profile.mapLayer;
          this.defaultDataset = profile.defaultDataset;
        }
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserAuth).subscribe(
        user => this.userAuth = user
      )
    );

    this.subs.add(
      this.store$.select(userStore.getSavedFilters).subscribe(savedFilters =>
        {
          for(const searchtype in SearchType) {
            if(searchtype !== "LIST" && searchtype !== "CUSTOM_PRODUCTS") {
              this.userFiltersBySearchType[SearchType[searchtype]] = [];
            }
          }

          savedFilters.forEach(preset => this.userFiltersBySearchType[preset.searchType].push(preset));

          console.log(this.userFiltersBySearchType);
        }
        )
    );

  }

  public onClose(): void {
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

  public onChangeDefaultFilterType(filterID: string, searchType: string): void {
    // this.defaultMapLayer = layerType;
    this.selectedFiltersIDs[SearchType[searchType]] = filterID;
    console.log(this.selectedFiltersIDs);
    // this.saveProfile();
  }

  public saveProfile(): void {
    const action = new userStore.SetProfile({
      maxResults: this.defaultMaxResults,
      mapLayer: this.defaultMapLayer,
      defaultDataset: this.defaultDataset
    });

    this.store$.dispatch(action);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
