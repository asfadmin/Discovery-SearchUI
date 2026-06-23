import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { tap } from 'rxjs/operators';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { PropertyService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';
import { MatFormField, MatHint } from '@angular/material/input';
import {
  MatSelect,
  MatSelectTrigger,
  MatOption,
} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { JoinPipe } from '@pipes/join.pipe';
import { PolarizationCountPipe } from '@pipes/polarization.pipe';
import { IsRelevantPipe } from '@pipes/relevant.pipe';
@Component({
  selector: 'app-observation-panel-selector',
  templateUrl: './observation-panel-selector.component.html',
  styleUrl: './observation-panel-selector.component.scss',
  imports: [
    MatFormField,
    MatSelect,
    FormsModule,
    MatSelectTrigger,

    MatOption,

    MatHint,
    MatSlideToggle,
    MatTooltip,
    KeyValuePipe,
    TranslateModule,
    JoinPipe,
    PolarizationCountPipe,
    IsRelevantPipe,
  ],
})
export class ObservationPanelSelectorComponent implements OnDestroy, OnInit {
  private store$ = inject<Store<AppState>>(Store);
  prop = inject(PropertyService);

  dataset: models.Dataset;
  productTypes: models.DatasetProductTypes;
  flightDirections: models.FlightDirection[];
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  sidePolarizations: models.DatasetPolarizations;
  platforms: models.DatasetPlatforms;
  groupID: string;
  frameCoverage: string[];
  rangeBandwidth: string[];
  jointObservation: boolean;
  instruments: string[];

  public datasetProductTypes$ = this.store$.select(
    filtersStore.getProductTypes,
  );
  public flightDirections$ = this.store$.select(
    filtersStore.getFlightDirections,
  );
  public instruments$ = this.store$.select(filtersStore.getInstruments);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public sidePolarizations$ = this.store$.select(
    filtersStore.getSidePolarizations,
  );
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public selectedDataset$ = this.store$.select(filtersStore.getSelectedDataset);
  public platforms$ = this.store$.select(filtersStore.getPlatforms);
  public groupID$ = this.store$.select(filtersStore.getGroupID);
  public frameCoverage$ = this.store$.select(filtersStore.getFrameCoverage);
  public jointObservation$ = this.store$.select(
    filtersStore.getJointObservation,
  );
  public rangeBandwidth$ = this.store$.select(filtersStore.getRangeBandwidth);
  public totalBandwithCount = 0;

  public flightDirectionTypes = models.flightDirections;
  public p = models.Props;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.selectedDataset$
        .pipe(
          tap((dataset) => {
            this.flightDirectionTypes =
              dataset.id === models.avnir.id
                ? models.justDescending
                : models.flightDirections;
            if (dataset.bandwidth) {
              this.totalBandwithCount = Object.values(dataset.bandwidth).reduce(
                (a, v) => a + v.length,
                0,
              );
            }
          }),
        )
        .subscribe((dataset) => (this.dataset = dataset)),
    );
    this.subs.add(
      this.beamModes$.subscribe((modes) => (this.beamModes = modes)),
    );
    this.subs.add(
      this.flightDirections$.subscribe(
        (directions) => (this.flightDirections = directions),
      ),
    );
    this.subs.add(
      this.datasetProductTypes$.subscribe(
        (types) => (this.productTypes = types),
      ),
    );
    this.subs.add(
      this.polarizations$.subscribe((pols) => (this.polarizations = pols)),
    );
    this.subs.add(
      this.sidePolarizations$.subscribe(
        (pols) => (this.sidePolarizations = pols),
      ),
    );
    this.subs.add(
      this.platforms$.subscribe((platforms) => (this.platforms = platforms)),
    );
    this.subs.add(
      this.groupID$.subscribe((groupID) => (this.groupID = groupID)),
    );
    this.subs.add(
      this.frameCoverage$.subscribe(
        (frameCoverage) => (this.frameCoverage = frameCoverage),
      ),
    );
    this.subs.add(
      this.jointObservation$.subscribe(
        (jointObservation) => (this.jointObservation = jointObservation),
      ),
    );
    this.subs.add(
      this.rangeBandwidth$.subscribe(
        (rangeBandwidth) => (this.rangeBandwidth = rangeBandwidth),
      ),
    );
    this.subs.add(
      this.instruments$.subscribe(
        (instruments) => (this.instruments = instruments),
      ),
    );
  }

  public onNewDatasetBeamModes(beamModes: string[]): void {
    this.store$.dispatch(new filtersStore.SetBeamModes(beamModes));
  }

  public onNewFlightDirectionsSelected(
    directions: models.FlightDirection[],
  ): void {
    this.store$.dispatch(new filtersStore.SetFlightDirections(directions));
  }

  public onNewDatasetPolarizations(polarizations: string[]): void {
    this.store$.dispatch(new filtersStore.SetPolarizations(polarizations));
  }

  public onNewDatasetSidePolarizations(polarizations: string[]): void {
    this.store$.dispatch(new filtersStore.SetSidePolarizations(polarizations));
  }

  public onNewProductTypes(productTypes: models.DatasetProductTypes): void {
    this.store$.dispatch(new filtersStore.SetProductTypes(productTypes));
  }

  public onNewShortNames(shortNames: models.DatasetShortName): void {
    this.store$.dispatch(new filtersStore.setShortNames(shortNames));
  }

  public onNewMaxResults(maxResults): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

  public onNewPlatformSelected(platforms: models.DatasetPlatforms): void {
    this.store$.dispatch(new filtersStore.SetPlatforms(platforms));
  }

  public onNewFrameCoverageSelected(coverage): void {
    this.store$.dispatch(new filtersStore.setFrameCoverage(coverage));
  }
  public onNewRangeBandwidthSelected(bandwidth) {
    this.store$.dispatch(new filtersStore.setRangeBandwidth(bandwidth));
  }

  public onNewJointObservation(observation) {
    this.store$.dispatch(new filtersStore.setJointObservation(observation));
  }
  public onNewInstrument(instruments) {
    this.store$.dispatch(new filtersStore.setIntstrument(instruments));
  }

  public onNewGroupID(): void {
    if (this.groupID.length > 29) {
      this.groupID = this.groupID.slice(0, 29);
    }
    this.store$.dispatch(new filtersStore.setGroupID(this.groupID));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
