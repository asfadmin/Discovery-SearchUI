import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-detailed-search-selector',
  templateUrl: './detailed-search-selector.component.html',
  styleUrls: ['./detailed-search-selector.component.css']
})
export class DetailedSearchSelectorComponent {
  @Input() selectedSearchType: models.SearchType;

  @Output() newSearchType = new EventEmitter<models.SearchType>();

  public searchTypes = models.SearchType;

  public onSetSearchType(searchType: models.SearchType): void {
    this.newSearchType.emit(searchType);
  }
}
