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
  selected: models.Platform[];
  productTypes: models.PlatformProductTypes;
  flightDirections: models.FlightDirection[];
  beamModes: models.PlatformBeamModes;
  polarizations: models.PlatformPolarizations;

  public platformProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public selectedPlatforms$ = this.store$.select(filtersStore.getSelectedPlatforms);

  public flightDirectionTypes = models.flightDirections;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.selectedPlatforms$.subscribe(platforms => this.selected = platforms);
    this.beamModes$.subscribe(modes => this.beamModes = modes);
    this.flightDirections$.subscribe(directions => this.flightDirections = directions);
    this.platformProductTypes$.subscribe(types => this.productTypes = types);
    this.polarizations$.subscribe(pols => this.polarizations = pols);
  }

  public onNewPlatformBeamModes(platform: models.Platform, beamModes: string[]): void {
    this.store$.dispatch(new filtersStore.SetPlatformBeamModes({ [platform.name]: beamModes }));
  }

  public onNewFlightDirectionsSelected(directions: models.FlightDirection[]): void {
    this.store$.dispatch(new filtersStore.SetFlightDirections(directions));
  }

  public onNewPlatformPolarizations(platform: models.Platform, polarizations: string[]): void {
    this.store$.dispatch(new filtersStore.SetPlatformPolarizations({ [platform.name]: polarizations }));
  }

  public onNewProductTypes(platform: models.Platform, productTypes: models.ProductType[]): void {
    this.store$.dispatch(new filtersStore.SetPlatformProductTypes({ [platform.name]: productTypes }));
  }

  public onNewMaxResults(maxResults): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }
}
