import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { PropertyService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.scss']
})
export class OtherSelectorComponent implements OnInit {
  dataset: models.Dataset;
  productTypes: models.DatasetProductTypes;
  flightDirections: models.FlightDirection[];
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  subtypes: models.DatasetSubtypes;

  public datasetProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public selectedDataset$ = this.store$.select(filtersStore.getSelectedDataset);
  public subtypes$ = this.store$.select(filtersStore.getSubtypes);

  public flightDirectionTypes = models.flightDirections;
  public p = models.Props;

  constructor(
    private store$: Store<AppState>,
    public prop: PropertyService,
  ) { }

  ngOnInit() {
    this.selectedDataset$.subscribe(dataset => this.dataset = dataset);
    this.beamModes$.subscribe(modes => this.beamModes = modes);
    this.flightDirections$.subscribe(directions => this.flightDirections = directions);
    this.datasetProductTypes$.subscribe(types => this.productTypes = types);
    this.polarizations$.subscribe(pols => this.polarizations = pols);
    this.subtypes$.subscribe(subtypes => this.subtypes = subtypes);
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

  public onNewProductTypes(productTypes: models.ProductType[]): void {
    this.store$.dispatch(new filtersStore.SetProductTypes(productTypes));
  }

  public onNewMaxResults(maxResults): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

  public onNewSubtypeSelected(subtypes): void {
    this.store$.dispatch(new filtersStore.SetSubtypes(subtypes));
  }
}
