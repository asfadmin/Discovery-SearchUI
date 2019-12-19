import { Component, OnInit } from '@angular/core';

import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';
import * as filtersStore from '@store/filters';

import { MatDialogRef } from '@angular/material';
import { MapLayerTypes } from '@models';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  public datasets$ = this.store$.select(filtersStore.getDatasetsList);

  public defaultMaxResults: number;
  public defaultMapLayer: MapLayerTypes;
  public defaultDataset: string;

  public maxResults = [250, 1000, 5000];
  public mapLayerTypes = MapLayerTypes;

  constructor(
    private dialogRef: MatDialogRef<PreferencesComponent>,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(userStore.getUserProfile).pipe(
      take(1)
    ).subscribe(
      profile => {
        this.defaultMaxResults = profile.maxResults;
        this.defaultMapLayer = profile.mapLayer;
        this.defaultDataset = profile.defaultDataset;
      }
    );
  }

  public onClose(): void {
    this.dialogRef.close({
      maxResults: this.defaultMaxResults,
      mapLayer: this.defaultMapLayer,
      defaultDataset: this.defaultDataset
    });
  }

  public onSelectionChange(dataset: string): void {
    this.defaultDataset = dataset;
  }

  public onChangeMaxResultsDefault(maxResults: number): void {
    this.defaultMaxResults = maxResults;
  }

  public onChangeDefaultLayerType(layerType: MapLayerTypes): void {
    this.defaultMapLayer = layerType;
  }
}
