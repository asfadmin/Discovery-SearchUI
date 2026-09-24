import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { GeographicFiltersType, ProductType } from '@models';
import { JoinPipe } from '@pipes/join.pipe';
import { ShortDatePipe } from '@pipes/short-date.pipe';

@Component({
  selector: 'app-geographic-search-filters',
  templateUrl: './geographic-search-filters.component.html',
  styleUrls: ['./geographic-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShortDatePipe, JoinPipe, TranslateModule],
})
export class GeographicSearchFiltersComponent {
  @Input() filters: GeographicFiltersType;

  public formatTypesList(fileTypes: ProductType[]): string {
    return fileTypes.map((filterType) => filterType.apiValue).join(', ');
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
      filters.platforms.length === 0
    );
  }

  public showSearchAreaType(polygon: string): string {
    return polygon.split('(')[0];
  }
}
