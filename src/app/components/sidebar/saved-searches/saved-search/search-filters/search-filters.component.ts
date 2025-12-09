import { Component, Input } from '@angular/core';

import * as models from '@models';
import { ListSearchFiltersComponent } from './list-search-filters/list-search-filters.component';
import { GeographicSearchFiltersComponent } from './geographic-search-filters/geographic-search-filters.component';
import { BaselineSearchFiltersComponent } from './baseline-search-filters/baseline-search-filters.component';
import { SbasSearchFiltersComponent } from './sbas-search-filters/sbas-search-filters.component';
import { DisplacementFiltersComponent } from './displacement-filters/displacement-filters.component';
import {
  DisplacementFilterPipe,
  BaselineFilterPipe,
  SBASFilterPipe,
  GeographicFilterPipe,
  ListFilterPipe,
} from '@pipes/filter-type.pipe';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
  imports: [
    ListSearchFiltersComponent,
    GeographicSearchFiltersComponent,
    BaselineSearchFiltersComponent,
    SbasSearchFiltersComponent,
    DisplacementFiltersComponent,
    DisplacementFilterPipe,
    BaselineFilterPipe,
    SBASFilterPipe,
    GeographicFilterPipe,
    ListFilterPipe,
  ],
})
export class SearchFiltersComponent {
  @Input() search: models.Search;

  public SearchType = models.SearchType;
}
