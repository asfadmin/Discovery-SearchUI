import { Component, OnInit, Input } from '@angular/core';

import { GeographicFiltersType } from '@models';

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

}
