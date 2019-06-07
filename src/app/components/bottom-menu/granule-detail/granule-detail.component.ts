import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import * as models from '@models';
import { DatapoolAuthService, MapService, WktService } from '@services';
import { ImageDialogComponent } from './image-dialog';

@Component({
  selector: 'app-granule-detail',
  templateUrl: './granule-detail.component.html',
  styleUrls: ['./granule-detail.component.css']
})
export class GranuleDetailComponent {
  @Input() granule: models.CMRProduct;
  @Input() platform: models.Platform;
  @Input() searchType: models.SearchType;

  public searchTypes = models.SearchType;
  public p = models.Props;

  constructor(
    public dialog: MatDialog,
    public authService: DatapoolAuthService,
    private store$: Store<AppState>,
  ) {}

  public onOpenImage(granule: models.CMRProduct): void {
    this.dialog.open(ImageDialogComponent, {
      height: '1200px',
      width: '1200px',
      maxWidth: '90%',
      maxHeight: '90%',
      panelClass: 'image-dialog'
    });
  }

  public isRelavent(prop: models.Props): boolean {
    return models.datasetProperties[prop].includes(this.platform.name);
  }

  public isGeoSearch(): boolean {
    return this.searchType === models.SearchType.DATASET;
  }

  public hasValue(v: any): boolean {
    return v !== null && v !== undefined;
  }

  public isSentinelGranule(): boolean {
    return this.platform.name === 'SENTINEL-1';
  }

  public shouldHideWith(platformNames: string[]): boolean {
    return platformNames.includes(this.platform.name);
  }

  public onlyShowWith(platformNames: string[]): boolean {
    return platformNames.includes(this.platform.name);
  }

  public onSetBeamMode(): void {
    this.store$.dispatch(
      new filtersStore.AddBeamMode(this.granule.metadata.beamMode)
    );
  }

  public setStartDate(): void {
    this.store$.dispatch(
      new filtersStore.SetStartDate(this.granule.metadata.date)
    );
  }

  public setEndDate(): void {
    this.store$.dispatch(
      new filtersStore.SetEndDate(this.granule.metadata.date)
    );
  }

  public setPathStart(): void {
    this.store$.dispatch(
      new filtersStore.SetPathStart(this.granule.metadata.path)
    );
  }

  public setPathEnd(): void {
    this.store$.dispatch(
      new filtersStore.SetPathEnd(this.granule.metadata.path)
    );
  }

  public setFrameStart(): void {
    this.store$.dispatch(
      new filtersStore.SetFrameStart(this.granule.metadata.frame)
    );
  }

  public setFrameEnd(): void {
    this.store$.dispatch(
      new filtersStore.SetFrameEnd(this.granule.metadata.frame)
    );
  }

  public setFlightDirection(): void {
    const dir = this.granule.metadata.flightDirection
      .toLowerCase();

    const capitalized = this.capitalizeFirstLetter(dir);

    this.store$.dispatch(
      new filtersStore.SetFlightDirections([<models.FlightDirection>capitalized])
    );
  }

  public addPolarization(): void {
    this.store$.dispatch(new filtersStore.AddPolarization(this.granule.metadata.polarization));
  }

  public onFindSimilarGranules(): void {
    this.setPathStart();
    this.setPathEnd();
    this.setFrameStart();
    this.setFrameEnd();
    this.store$.dispatch(new searchStore.MakeSearch());
  }

  private capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
