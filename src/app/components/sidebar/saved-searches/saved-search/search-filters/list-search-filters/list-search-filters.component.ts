import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ListFiltersType } from '@models';

@Component({
  selector: 'app-list-search-filters',
  templateUrl: './list-search-filters.component.html',
  styleUrls: ['./list-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ListSearchFiltersComponent {
  @Input() filters: ListFiltersType;

  public formatList(list: string[]): string {
    return list.join(', ');
  }
}
