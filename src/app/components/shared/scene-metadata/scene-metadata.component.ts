import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService } from '@services';


@Component({
  selector: 'app-scene-metadata',
  templateUrl: './scene-metadata.component.html',
  styleUrls: ['./scene-metadata.component.scss']
})
export class SceneMetadataComponent implements OnInit, OnDestroy {
  @Input() scene: models.CMRProduct;
  @Input() dataset: models.Dataset;
  @Input() searchType: models.SearchType;
  @Input() offsets = { temporal: 0, perpendicular: 0 };

  public p = models.Props;

  private subs = new SubSink();

  constructor(
    public prop: PropertyService,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  public isGeoSearch(): boolean {
    return this.searchType === models.SearchType.DATASET;
  }

  public isBaselineSearch(): boolean {
    return this.searchType === models.SearchType.BASELINE;
  }

  public hasValue(v: any): boolean {
    return v !== null && v !== undefined;
  }

  public setBeamMode(): void {
    const action = new filtersStore.AddBeamMode(this.scene.metadata.beamMode);
    this.store$.dispatch(action);
  }

  public setStartDate(date): void {
    const action = new filtersStore.SetStartDate(date.toDate());
    this.store$.dispatch(action);
  }

  public setEndDate(date): void {
    const action = new filtersStore.SetEndDate(date.toDate());
    this.store$.dispatch(action);
  }

  public setPathStart(): void {
    const action = new filtersStore.SetPathStart(this.scene.metadata.path);
    this.store$.dispatch(action);
  }

  public setPathEnd(): void {
    const action = new filtersStore.SetPathEnd(this.scene.metadata.path);
    this.store$.dispatch(action);
  }

  public setFrameStart(): void {
    const action = new filtersStore.SetFrameStart(this.scene.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFrameEnd(): void {
    const action = new filtersStore.SetFrameEnd(this.scene.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFlightDirection(): void {
    const dir = this.scene.metadata.flightDirection
    .toLowerCase();

    const capitalized = this.capitalizeFirstLetter(dir);

    const action = new filtersStore.SetFlightDirections([<models.FlightDirection>capitalized]);
    this.store$.dispatch(action);
  }

  public addPolarization(): void {
    const action = new filtersStore.AddPolarization(this.scene.metadata.polarization);
    this.store$.dispatch(action);
  }

  public addMission(): void {
    const action = new filtersStore.SelectMission(this.scene.metadata.missionName);
    this.store$.dispatch(action);
  }

  public setTemporalStart(): void {
    const action = new filtersStore.SetTemporalStart(
      this.scene.metadata.temporal + this.offsets.temporal
    );

    this.store$.dispatch(action);
  }

  public setTemporalEnd(): void {
    const action = new filtersStore.SetTemporalEnd(
      this.scene.metadata.temporal + this.offsets.temporal
    );

    this.store$.dispatch(action);
  }

  public setPerpendicularStart(): void {
    const action = new filtersStore.SetPerpendicularStart(
      this.scene.metadata.perpendicular + this.offsets.perpendicular
    );

    this.store$.dispatch(action);
  }

  public setPerpendicularEnd(): void {
    const action = new filtersStore.SetPerpendicularEnd(
      this.scene.metadata.perpendicular + this.offsets.perpendicular
    );

    this.store$.dispatch(action);
  }

  private capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
