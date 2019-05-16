import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() isLoading: boolean;
  @Input() maxResults: number;
  @Input() currentSearchAmount: number;
  @Input() canSearch: boolean;

  @Output() newSearch = new EventEmitter<void>();
  @Output() clearSearches = new EventEmitter<void>();
  @Output() newMaxResults = new EventEmitter<number>();

  public onNewMaxResults(maxResults: number): void {
    this.newMaxResults.emit(maxResults);
  }
}
