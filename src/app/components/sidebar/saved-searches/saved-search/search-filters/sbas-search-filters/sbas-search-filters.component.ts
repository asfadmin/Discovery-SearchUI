import { Component, Input } from '@angular/core';

import { SbasFiltersType } from '@models';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-sbas-search-filters',
  templateUrl: './sbas-search-filters.component.html',
  styleUrls: ['./sbas-search-filters.component.scss'],
  imports: [NgIf, TranslateModule],
})
export class SbasSearchFiltersComponent {
  @Input() filters: SbasFiltersType;
}
