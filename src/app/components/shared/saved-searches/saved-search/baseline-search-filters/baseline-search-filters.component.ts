import { Component, OnInit, Input } from '@angular/core';

import { BaselineFiltersType } from '@models';

@Component({
  selector: 'app-baseline-search-filters',
  templateUrl: './baseline-search-filters.component.html',
  styleUrls: ['./baseline-search-filters.component.scss']
})
export class BaselineSearchFiltersComponent implements OnInit {
  @Input() filters: BaselineFiltersType;

  constructor() { }

  ngOnInit(): void {
  }

}
