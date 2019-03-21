import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-compact-search-selector',
  templateUrl: './compact-search-selector.component.html',
  styleUrls: ['./compact-search-selector.component.css']
})
export class CompactSearchSelectorComponent {
  @Input() selectedSearchType: models.SearchType;

  @Output() newSearchType = new EventEmitter<models.SearchType>();

  public searchTypes = models.SearchType;

  public onSetSearchType(searchType: models.SearchType): void {
    this.newSearchType.emit(
      searchType === this.selectedSearchType ?
        null : searchType
    );
  }
}
