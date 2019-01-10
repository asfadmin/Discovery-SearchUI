import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FilterType } from '../../models';

export interface FilterSelector {
    title: string;
    iconName: string;
    type: FilterType;
}

@Component({
  selector: 'app-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.css']
})
export class FilterSelectorComponent {
  @Input() selectedFilter: FilterType;
  @Output() newFilterSelected = new EventEmitter<FilterType>();

  public filterType = FilterType;

  filters: FilterSelector[] = [{
    title: 'Platform',
    iconName: 'satellite',
    type: FilterType.PLATFORM
  }, {
    title: 'Date',
    iconName: 'calendar',
    type: FilterType.DATE
  }, {
    title: 'Path',
    iconName: 'path',
    type: FilterType.PATH
  }, {
    title: 'Other',
    iconName: 'other',
    type: FilterType.OTHER
  }];

  public onFilterSelected(filterType: FilterType): void {
    const newFilter = filterType === this.selectedFilter ?
      FilterType.NONE :
      filterType;

    this.newFilterSelected.emit(newFilter);
  }
}
