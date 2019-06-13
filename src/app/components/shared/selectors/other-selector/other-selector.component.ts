import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.scss']
})
export class OtherSelectorComponent implements OnInit {
  selected: models.Dataset[];
  productTypes: models.DatasetProductTypes;
  flightDirections: models.FlightDirection[];
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;

  public datasetProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public selectedDatasets$ = this.store$.select(filtersStore.getSelectedDatasets);

  public flightDirectionTypes = models.flightDirections;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.selectedDatasets$.subscribe(datasets => this.selected = datasets);
    this.beamModes$.subscribe(modes => this.beamModes = modes);
    this.flightDirections$.subscribe(directions => this.flightDirections = directions);
    this.datasetProductTypes$.subscribe(types => this.productTypes = types);
    this.polarizations$.subscribe(pols => this.polarizations = pols);
  }

  public onNewDatasetBeamModes(dataset: models.Dataset, beamModes: string[]): void {
    this.store$.dispatch(new filtersStore.SetDatasetBeamModes({ [dataset.name]: beamModes }));
  }

  public onNewFlightDirectionsSelected(directions: models.FlightDirection[]): void {
    this.store$.dispatch(new filtersStore.SetFlightDirections(directions));
  }

  public onNewDatasetPolarizations(dataset: models.Dataset, polarizations: string[]): void {
    this.store$.dispatch(new filtersStore.SetDatasetPolarizations({ [dataset.name]: polarizations }));
  }

  public onNewProductTypes(dataset: models.Dataset, productTypes: models.ProductType[]): void {
    this.store$.dispatch(new filtersStore.SetDatasetProductTypes({ [dataset.name]: productTypes }));
  }

  public onNewMaxResults(maxResults): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }
}
