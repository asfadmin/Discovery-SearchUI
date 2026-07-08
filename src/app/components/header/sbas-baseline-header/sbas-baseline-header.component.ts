import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';
import { AoiFilterComponent } from '@components/header/dataset-header/aoi-filter/aoi-filter.component';

import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

import * as models from '@models';

@Component({
  selector: 'app-sbas-baseline-header',
  imports: [
    SearchTypeSelectorComponent,
    SearchButtonComponent,
    HeaderButtonsComponent,
    MatSelectModule,
    TranslateModule,
    MatIconModule,
    AoiFilterComponent,
  ],
  templateUrl: './sbas-baseline-header.component.html',
  styleUrls: [
    './sbas-baseline-header.component.scss',
    '../header.component.scss',
  ],
})
export class SbasBaselineHeaderComponent {
  private store$ = inject<Store<AppState>>(Store);

  readonly datasetIds = {
    sentinel1: models.sentinel_1.id,
    sentinel1Bursts: models.sentinel_1_bursts.id,
    aria: models.beta.id,
  } as const;

  readonly datasets = [
    {
      name: models.sentinel_1.name,
      id: models.sentinel_1.id,
    },
    {
      name: models.sentinel_1_bursts.name,
      id: models.sentinel_1_bursts.id,
    },
    {
      name: models.beta.name,
      id: models.beta.id,
    },
  ] as const;

  public directions = models.FlightDirection;
  public flightDirections = this.store$.selectSignal(
    filtersStore.getFlightDirections,
  );

  public dataset = this.store$.selectSignal(filtersStore.getSelectedDataset);

  onFlightDirectionChange(direction: models.FlightDirection) {
    this.store$.dispatch(
      new filtersStore.SetFlightDirections(
        direction === null ? [] : [direction],
      ),
    );
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.SetSelectedDataset(dataset));

    if (this.dataset().id === models.sentinel_1.id) {
      this.store$.dispatch(
        new filtersStore.SetProductTypes(
          models.sentinel_1.productTypes.filter((pt) => pt.apiValue === 'SLC'),
        ),
      );
    }
  }
}
