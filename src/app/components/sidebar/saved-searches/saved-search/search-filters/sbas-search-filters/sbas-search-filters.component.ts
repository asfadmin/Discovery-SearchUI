import { Component, Input } from '@angular/core';

import { SbasFiltersType } from '@models';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-sbas-search-filters',
  templateUrl: './sbas-search-filters.component.html',
  styleUrls: ['./sbas-search-filters.component.scss'],
  imports: [TranslateModule],
})
export class SbasSearchFiltersComponent {
  @Input() filters: SbasFiltersType;
}
