import { Component, Input } from '@angular/core';

import * as models from '@models';

@Component({
    selector: 'app-search-filters',
    templateUrl: './search-filters.component.html',
    styleUrls: ['./search-filters.component.scss'],
    standalone: false
})
export class SearchFiltersComponent {
  @Input() search: models.Search;

  public SearchType = models.SearchType;
}
