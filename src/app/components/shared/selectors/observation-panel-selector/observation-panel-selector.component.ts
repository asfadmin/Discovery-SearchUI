import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { tap } from 'rxjs/operators';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { PropertyService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';
@Component({
  selector: 'app-observation-panel-selector',
  templateUrl: './observation-panel-selector.component.html',
  styleUrl: './observation-panel-selector.component.scss'
})
export class ObservationPanelSelectorComponent implements OnDestroy, OnInit{
  dataset: models.Dataset;
  productTypes: models.DatasetProductTypes;
  flightDirections: models.FlightDirection[];
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  sidePolarizations: models.DatasetPolarizations;
  subtypes: models.DatasetSubtypes;
  groupID: string;
  frameCoverage: string[];
  rangeBandwith: string[];
  jointObservation: boolean;
  instruments: string[];

  public datasetProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public instruments$ = this.store$.select(filtersStore.getInstruments);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public sidePolarizations$ = this.store$.select(filtersStore.getSidePolarizations);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public selectedDataset$ = this.store$.select(filtersStore.getSelectedDataset);
  public subtypes$ = this.store$.select(filtersStore.getSubtypes);
  public groupID$ = this.store$.select(filtersStore.getGroupID);
  public frameCoverage$ = this.store$.select(filtersStore.getFrameCoverage);
  public jointObservation$ = this.store$.select(filtersStore.getJointObservation)
  public rangeBandwith$ = this.store$.select(filtersStore.getRangeBandwith)


  public flightDirectionTypes = models.flightDirections;
  public p = models.Props;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    public prop: PropertyService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.selectedDataset$.pipe(
        tap(
          dataset => this.flightDirectionTypes = dataset.id === models.avnir.id ?
            models.justDescending : models.flightDirections
        )
      ).subscribe(dataset => this.dataset = dataset)
    );
    this.subs.add(
      this.beamModes$.subscribe(modes => this.beamModes = modes)
    );
    this.subs.add(
      this.flightDirections$.subscribe(directions => this.flightDirections = directions)
    );
    this.subs.add(
      this.datasetProductTypes$.subscribe(types => this.productTypes = types)
    );
    this.subs.add(
      this.polarizations$.subscribe(pols => this.polarizations = pols)
    );
    this.subs.add(
        this.sidePolarizations$.subscribe(pols => this.sidePolarizations = pols)
    );
    this.subs.add(
      this.subtypes$.subscribe(subtypes => this.subtypes = subtypes)
    );
    this.subs.add(
      this.groupID$.subscribe(groupID => this.groupID = groupID)
    );
    this.subs.add(
        this.frameCoverage$.subscribe(frameCoverage => this.frameCoverage = frameCoverage)
    );
    this.subs.add(
        this.jointObservation$.subscribe(jointObservation => this.jointObservation = jointObservation)
    );
    this.subs.add(
        this.rangeBandwith$.subscribe(rangeBandwith => this.rangeBandwith = rangeBandwith)
    );
    this.subs.add(
        this.instruments$.subscribe(instruments => this.instruments = instruments)
    );
  }

  public onNewDatasetBeamModes(beamModes: string[]): void {
    this.store$.dispatch(new filtersStore.SetBeamModes(beamModes));
  }

  public onNewFlightDirectionsSelected(directions: models.FlightDirection[]): void {
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

  public onNewSubtypeSelected(subtypes): void {
    this.store$.dispatch(new filtersStore.SetSubtypes(subtypes));
  }
  public onNewFrameCoverageSelected(coverage): void {
    // this value needs to be converted to a boolean value since the data is set for
    // true = full frame
    // false = partial frame
    // null = all
    this.store$.dispatch(new filtersStore.setFrameCoverage(coverage));
  }
  public onNewRangeBandwithSelected(bandwith) {
    this.store$.dispatch(new filtersStore.setRangeBandwith(bandwith))
  }

  public onNewJointObservation(observation) {
    this.store$.dispatch(new filtersStore.setJointObservation(observation))
  }
  public onNewInstrument(instruments) {
    this.store$.dispatch(new filtersStore.setIntstrument(instruments))
  }

  public onNewGroupID(): void {
    if(this.groupID.length > 29) {
      this.groupID = this.groupID.slice(0, 29);
    }
    this.store$.dispatch(new filtersStore.setGroupID(this.groupID));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
