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

  @Output() newSearch = new EventEmitter<void>();
  @Output() clearSearches = new EventEmitter<void>();
  @Output() newMaxResults = new EventEmitter<number>();

  public possibleMaxResults = [100, 1000, 10000];

  public onNewMaxResults(maxResults: number): void {
    this.newMaxResults.emit(maxResults);
  }

  formatNumber(num: number): string {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
