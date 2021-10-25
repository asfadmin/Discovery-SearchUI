import { Component, OnInit, Input } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit {
  @Input() search: models.Search;

  public SearchType = models.SearchType;

  constructor() { }

  ngOnInit(): void {
  }

}
