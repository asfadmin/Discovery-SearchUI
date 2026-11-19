import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DisplacementFiltersType } from '@models';
import { ShortDatePipe } from '@pipes/short-date.pipe';

@Component({
  selector: 'app-displacement-filters',
  templateUrl: './displacement-filters.component.html',
  styleUrl: './displacement-filters.component.scss',
  imports: [KeyValuePipe, ShortDatePipe, TranslateModule],
})
export class DisplacementFiltersComponent {
  readonly filters = input<DisplacementFiltersType>();
}
