import { Component, Input } from '@angular/core';

import { SbasFiltersType } from '@models';
@Component({
  selector: 'app-sbas-search-filters',
  templateUrl: './sbas-search-filters.component.html',
  styleUrls: ['./sbas-search-filters.component.scss'],
})
export class SbasSearchFiltersComponent {
  @Input() filters: SbasFiltersType;
}
