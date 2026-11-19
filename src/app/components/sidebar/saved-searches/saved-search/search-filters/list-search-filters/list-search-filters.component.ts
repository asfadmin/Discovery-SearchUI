import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ListFiltersType } from '@models';

@Component({
  selector: 'app-list-search-filters',
  templateUrl: './list-search-filters.component.html',
  styleUrls: ['./list-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class ListSearchFiltersComponent {
  readonly filters = input<ListFiltersType>();

  public formatList(list: string[]): string {
    return list.join(', ');
  }
}
