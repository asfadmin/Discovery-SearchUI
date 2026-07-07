import { Component, signal, computed } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';

import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';
import { AoiFilterComponent } from '@components/header/dataset-header/aoi-filter/aoi-filter.component';

import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

import * as models from '@models';

interface SearchParams {
  datasetId: string;
  flightDirection: models.FlightDirection | null;
}

@Component({
  selector: 'app-sbas-baseline-header',
  imports: [
    SearchTypeSelectorComponent,
    SearchButtonComponent,
    HeaderButtonsComponent,
    MatSelectModule,
    TranslateModule,
    FormField,
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
  readonly datasetIds = {
    sentinel1: models.sentinel_1.id,
    sentinel1Bursts: models.sentinel_1_bursts.id,
    multiburst: 'S1-MULTIBURST',
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
      name: 'S1 Multiburst',
      id: 'S1-MULTIBURST',
    },
    {
      name: models.beta.name,
      id: models.beta.id,
    },
  ] as const;

  public flightDirections = models.FlightDirection;

  selectedDataset = computed(() => this.searchModel().datasetId);
  selectedFlightDirection = computed(() => this.searchModel().flightDirection);

  searchModel = signal<SearchParams>({
    datasetId: models.sentinel_1.id,
    flightDirection: null,
  });
  searchForm = form(this.searchModel);
}
