import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FilterType } from '../../models';

@Component({
  selector: 'app-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.css']
})
export class FilterSelectorComponent {
  @Input() selectedFilter: FilterType;
  @Output() newFilterSelected = new EventEmitter<FilterType>();

  public filterType = FilterType;

  public onPlatformFilterSelected(): void {
    this.newFilterSelected.emit(FilterType.PLATFORM);
  }

  public onDateFilterSelected(): void {
    this.newFilterSelected.emit(FilterType.DATE);
  }

  public onPathFilterSelected(): void {
    this.newFilterSelected.emit(FilterType.PATH);
  }

  public onOtherFilterSelected(): void {
    this.newFilterSelected.emit(FilterType.OTHER);
  }
}
