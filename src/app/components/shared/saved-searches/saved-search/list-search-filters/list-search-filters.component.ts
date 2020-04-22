import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { ListFiltersType } from '@models';

@Component({
  selector: 'app-list-search-filters',
  templateUrl: './list-search-filters.component.html',
  styleUrls: ['./list-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSearchFiltersComponent implements OnInit {
  @Input() filters: ListFiltersType;

  constructor() { }

  ngOnInit() {
  }

  public formatList(list: string[]): string {
    return list.join(', ');
  }
}
