import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ListFiltersType } from '@models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-list-search-filters',
  templateUrl: './list-search-filters.component.html',
  styleUrls: ['./list-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class ListSearchFiltersComponent {
  @Input() filters: ListFiltersType;

  public formatList(list: string[]): string {
    return list.join(', ');
  }
}
