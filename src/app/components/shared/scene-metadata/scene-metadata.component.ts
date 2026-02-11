import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService } from '@services';
import { UpperCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {
  MatMenuTrigger,
  MatMenu,
  MatMenuItem,
  MatMenuContent,
} from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { ShortDateTimePipe } from '@pipes/short-date.pipe';
import { JoinPipe } from '@pipes/join.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scene-metadata',
  templateUrl: './scene-metadata.component.html',
  styleUrls: ['./scene-metadata.component.scss'],
  imports: [
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    MatMenuContent,
    UpperCasePipe,
    ShortDateTimePipe,
    JoinPipe,
    TranslateModule,
  ],
})
export class SceneMetadataComponent implements OnInit, OnDestroy {
  prop = inject(PropertyService);
  private store$ = inject<Store<AppState>>(Store);

  @Input() scene: models.CMRProduct;
  @Input() dataset: models.Dataset;
  @Input() searchType: models.SearchType;
  @Input() offsets = { temporal: 0, perpendicular: 0 };

  public p = models.Props;
  readonly tropoId = models.tropo.id;
  public selectedDataset: string;
  public selectedDatasetIsNISARFormat = false;

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(filtersStore.getSelectedDatasetId)
        .subscribe((selected) => {
          this.selectedDataset = selected;
          if (this.selectedDataset === 'SENTINEL-1 INTERFEROGRAM (BETA)') {
            this.selectedDatasetIsNISARFormat = true;
          } else {
            this.selectedDatasetIsNISARFormat = false;
          }
        }),
    );
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
    const dir = this.scene.metadata.flightDirection.toLowerCase();

    const capitalized = this.capitalizeFirstLetter(dir);

    const action = new filtersStore.SetFlightDirections([
      capitalized as models.FlightDirection,
    ]);
    this.store$.dispatch(action);
  }
  public setFrameCoverage(): void {
    const action = new filtersStore.setFrameCoverage([
      this.scene.metadata.nisar?.frameCoverage,
    ]);
    this.store$.dispatch(action);
  }

  public addPolarization(): void {
    const action = new filtersStore.AddPolarization(
      this.scene.metadata.polarization,
    );
    this.store$.dispatch(action);
  }
  public addMainPolarization(): void {
    const action = new filtersStore.AddPolarization(
      this.scene.metadata.nisar?.mainBandPolarization,
    );
    this.store$.dispatch(action);
  }
  public addSidePolarization(): void {
    const action = new filtersStore.AddSidePolarization(
      this.scene.metadata.nisar?.sideBandPolarization,
    );
    this.store$.dispatch(action);
  }

  public addMission(): void {
    const action = new filtersStore.SelectMission(
      this.scene.metadata.missionName,
    );
    this.store$.dispatch(action);
  }

  public addRangeBandwidth(): void {
    const action = new filtersStore.addRangeBandwidth(
      this.scene.metadata.nisar?.rangeBandwidth,
    );
    this.store$.dispatch(action);
  }

  public setTemporalStart(): void {
    const action = new filtersStore.SetTemporalStart(
      this.scene.metadata.temporal + this.offsets.temporal,
    );

    this.store$.dispatch(action);
  }

  public setTemporalEnd(): void {
    const action = new filtersStore.SetTemporalEnd(
      this.scene.metadata.temporal + this.offsets.temporal,
    );

    this.store$.dispatch(action);
  }

  public setPerpendicularStart(): void {
    const action = new filtersStore.SetPerpendicularStart(
      this.scene.metadata.perpendicular + this.offsets.perpendicular,
    );

    this.store$.dispatch(action);
  }

  public setPerpendicularEnd(): void {
    const action = new filtersStore.SetPerpendicularEnd(
      this.scene.metadata.perpendicular + this.offsets.perpendicular,
    );

    this.store$.dispatch(action);
  }

  public setFullBurst(): void {
    this.store$.dispatch(
      new filtersStore.setFullBurst([this.scene.metadata.burst.fullBurstID]),
    );
  }

  public setOperaBurst(): void {
    this.store$.dispatch(
      new filtersStore.setOperaBurstID([
        this.scene.metadata.opera.operaBurstID,
      ]),
    );
  }

  private capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
