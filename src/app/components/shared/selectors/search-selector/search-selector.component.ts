import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';

import * as models from '@models';

@Component({
  selector: 'app-search-selector',
  templateUrl: './search-selector.component.html',
  styleUrls: ['./search-selector.component.scss'],
  imports: [
    MatCard,
    MatDivider,
    MatList,
    MatListItem,
    MatIcon,
    TranslateModule,
  ],
})
export class SearchSelectorComponent {
  @Input() selectedSearchType: models.SearchType;

  @Output() newSearchType = new EventEmitter<models.SearchType>();

  public searchTypes = models.SearchType;

  public onSetSearchType(searchType: models.SearchType): void {
    this.newSearchType.emit(searchType);
  }
}
