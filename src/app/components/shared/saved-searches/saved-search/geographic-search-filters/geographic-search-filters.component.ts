import { Component, OnInit, Input } from '@angular/core';

import { GeographicFiltersType, ProductType } from '@models';

@Component({
  selector: 'app-geographic-search-filters',
  templateUrl: './geographic-search-filters.component.html',
  styleUrls: ['./geographic-search-filters.component.scss']
})
export class GeographicSearchFiltersComponent implements OnInit {
  @Input() filters: GeographicFiltersType;

  constructor() { }

  ngOnInit() {
  }

  public formatProductTypesList(fileTypes: ProductType[]): string {
    return fileTypes
      .map(subtype => subtype.apiValue)
      .join(', ');
  }

  public noFilters(filters: GeographicFiltersType): boolean {
    return (
      !filters.dateRange.start &&
      !filters.dateRange.end &&
      !filters.pathRange.start &&
      !filters.pathRange.end &&
      !filters.frameRange.start &&
      !filters.frameRange.end &&
      !filters.season.start &&
      !filters.season.end &&
      filters.productTypes.length === 0 &&
      filters.beamModes.length === 0 &&
      filters.polarizations.length === 0 &&
      filters.flightDirections.length === 0 &&
      filters.subtypes.length === 0
    );
  }
}
