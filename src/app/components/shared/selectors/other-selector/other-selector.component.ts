import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { tap } from 'rxjs/operators';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { PropertyService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';
import { ProductTypeSelectorComponent } from '../product-type-selector/product-type-selector.component';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ShortNameSelectorComponent } from '../short-name-selector/short-name-selector.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.scss'],
  imports: [
    ProductTypeSelectorComponent,
    MatFormField,
    MatSelect,
    FormsModule,

    MatOption,
    MatHint,
    MatLabel,
    MatInput,
    ShortNameSelectorComponent,
    TranslateModule,
  ],
})
export class OtherSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  prop = inject(PropertyService);

  dataset: models.Dataset;
  productTypes: models.DatasetProductTypes;
  flightDirections: models.FlightDirection[];
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  satellites: models.DatasetSatellites;
  groupID: string;
  tileID: string;
  ariaVersion: string;

  public datasetProductTypes$ = this.store$.select(
    filtersStore.getProductTypes,
  );
  public flightDirections$ = this.store$.select(
    filtersStore.getFlightDirections,
  );
  public beamModes$ = this.store$.select(filtersStore.getBeamModes);
  public polarizations$ = this.store$.select(filtersStore.getPolarizations);
  public selectedDataset$ = this.store$.select(filtersStore.getSelectedDataset);
  public satellites$ = this.store$.select(filtersStore.getSatellites);
  public groupID$ = this.store$.select(filtersStore.getGroupID);
  public tileID$ = this.store$.select(filtersStore.getTileID);
  public flightDirectionTypes = models.flightDirections;
  public p = models.Props;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.selectedDataset$
        .pipe(
          tap(
            (dataset) =>
              (this.flightDirectionTypes =
                dataset.id === models.avnir.id
                  ? models.justDescending
                  : models.flightDirections),
          ),
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
      this.satellites$.subscribe(
        (satellites) => (this.satellites = satellites),
      ),
    );
    this.subs.add(
      this.groupID$.subscribe((groupID) => (this.groupID = groupID)),
    );
    this.subs.add(this.tileID$.subscribe((tileID) => (this.tileID = tileID)));
    this.subs.add(
      this.store$
        .select(filtersStore.getAriaVersion)
        .subscribe((version) => (this.ariaVersion = version)),
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

  public onNewProductTypes(productTypes: models.DatasetProductTypes): void {
    this.store$.dispatch(new filtersStore.SetProductTypes(productTypes));
  }

  public onNewShortNames(shortNames: models.DatasetShortName): void {
    this.store$.dispatch(new filtersStore.setShortNames(shortNames));
  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

  public onNewSatelliteSelected(satellites: models.DatasetSatellites): void {
    this.store$.dispatch(new filtersStore.SetSatellites(satellites));
  }

  public onNewAriaVersionSelected(version: string): void {
    this.store$.dispatch(new filtersStore.setAriaVersion(version));
  }

  public onNewTileID(): void {
    this.store$.dispatch(new filtersStore.setTileID(this.tileID));
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
