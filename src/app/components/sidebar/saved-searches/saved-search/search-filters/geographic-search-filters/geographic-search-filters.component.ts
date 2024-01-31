import { Component, OnInit, Input, ChangeDetectionStrategy  } from '@angular/core';

import { GeographicFiltersType, ProductType } from '@models';

@Component({
  selector: 'app-geographic-search-filters',
  templateUrl: './geographic-search-filters.component.html',
  styleUrls: ['./geographic-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeographicSearchFiltersComponent implements OnInit {
  @Input() filters: GeographicFiltersType;

  constructor() { }

  ngOnInit() {
  }

  public formatTypesList(fileTypes: ProductType[]): string {
    return fileTypes
      .map(subtype => subtype.apiValue)
      .join(', ');
  }

  public noFilters(filters: GeographicFiltersType): boolean {
    return (
      !filters.selectedDataset &&
      !filters.polygon &&
      !filters.dateRange.start &&
      !filters.dateRange.end &&
      !filters.pathRange.start &&
      !filters.pathRange.end &&
      !filters.frameRange.start &&
      !filters.frameRange.end &&
      !filters.season.start &&
      !filters.season.end &&
      !filters.selectedMission &&
      !filters.fullBurstIDs &&
      !filters.useCalibrationData &&
      filters.productTypes.length === 0 &&
      filters.beamModes.length === 0 &&
      filters.polarizations.length === 0 &&
      filters.flightDirections.length === 0 &&
      filters.subtypes.length === 0
    );
  }

  public showSearchAreaType(polygon: string): string {
    return polygon.split('(')[0];
  }
}
