import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BaselineFiltersType } from '@models';
import { ShortDatePipe } from '@pipes/short-date.pipe';

@Component({
  selector: 'app-baseline-search-filters',
  templateUrl: './baseline-search-filters.component.html',
  styleUrls: ['./baseline-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShortDatePipe, TranslateModule],
})
export class BaselineSearchFiltersComponent {
  readonly filters = input<BaselineFiltersType>();
}
