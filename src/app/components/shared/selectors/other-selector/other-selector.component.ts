import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { tap } from 'rxjs/operators';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { PropertyService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.scss']
})
export class OtherSelectorComponent implements OnInit, OnDestroy {
  dataset: models.Dataset;
  productTypes: models.DatasetProductTypes;
  flightDirections: models.FlightDirection[];
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  subtypes: models.DatasetSubtypes;
  groupID: string;

  public datasetProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public selectedDataset$ = this.store$.select(filtersStore.getSelectedDataset);
  public subtypes$ = this.store$.select(filtersStore.getSubtypes);
  public groupID$ = this.store$.select(filtersStore.getGroupID);

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
      this.subtypes$.subscribe(subtypes => this.subtypes = subtypes)
    );
    this.subs.add(
      this.groupID$.subscribe(groupID => this.groupID = groupID)
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

  public onNewProductTypes(productTypes: models.DatasetProductTypes): void {
    this.store$.dispatch(new filtersStore.SetProductTypes(productTypes));
  }

  public onNewMaxResults(maxResults): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

  public onNewSubtypeSelected(subtypes): void {
    this.store$.dispatch(new filtersStore.SetSubtypes(subtypes));
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
