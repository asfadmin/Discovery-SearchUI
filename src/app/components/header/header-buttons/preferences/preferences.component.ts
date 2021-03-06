import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';

import { MatDialogRef } from '@angular/material/dialog';
import { MapLayerTypes, UserAuth, ProductType, datasetList } from '@models';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  public datasets = datasetList;
  public defaultMaxResults: number;
  public defaultMapLayer: MapLayerTypes;
  public defaultDataset: string;
  public defaultProductTypes: ProductType[];

  public maxResults = [250, 1000, 5000];
  public mapLayerTypes = MapLayerTypes;

  public userAuth: UserAuth;

  constructor(
    private dialogRef: MatDialogRef<PreferencesComponent>,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(userStore.getUserProfile).subscribe(
      profile => {
        this.defaultMaxResults = profile.maxResults;
        this.defaultMapLayer = profile.mapLayer;
        this.defaultDataset = profile.defaultDataset;
      }
    );

    this.store$.select(userStore.getUserAuth).subscribe(
      user => this.userAuth = user
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

  public saveProfile(): void {
    const action = new userStore.SetProfile({
      maxResults: this.defaultMaxResults,
      mapLayer: this.defaultMapLayer,
      defaultDataset: this.defaultDataset
    });

    this.store$.dispatch(action);
  }
}
