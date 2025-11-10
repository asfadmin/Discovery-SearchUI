import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { BaselineFiltersType } from '@models';
import { ShortDatePipe } from '../../../../../../pipes/short-date.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-baseline-search-filters',
  templateUrl: './baseline-search-filters.component.html',
  styleUrls: ['./baseline-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShortDatePipe, TranslateModule],
})
export class BaselineSearchFiltersComponent {
  @Input() filters: BaselineFiltersType;
}
