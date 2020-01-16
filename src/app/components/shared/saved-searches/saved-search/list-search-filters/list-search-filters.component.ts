import { Component, OnInit, Input } from '@angular/core';

import { ListFiltersType } from '@models';

@Component({
  selector: 'app-list-search-filters',
  templateUrl: './list-search-filters.component.html',
  styleUrls: ['./list-search-filters.component.scss']
})
export class ListSearchFiltersComponent implements OnInit {
  @Input() filters: ListFiltersType;

  constructor() { }

  ngOnInit() {
  }

}
