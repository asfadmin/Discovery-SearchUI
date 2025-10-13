import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { BaselineFiltersType } from '@models';

@Component({
  selector: 'app-baseline-search-filters',
  templateUrl: './baseline-search-filters.component.html',
  styleUrls: ['./baseline-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineSearchFiltersComponent {
  @Input() filters: BaselineFiltersType;

}
