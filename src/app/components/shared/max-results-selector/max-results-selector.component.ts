import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-max-results-selector',
  templateUrl: './max-results-selector.component.html',
  styleUrls: ['./max-results-selector.component.css']
})
export class MaxResultsSelectorComponent {
  @Input() maxResults: number;
  @Input() currentSearchAmount: number;

  @Output() newMaxResults = new EventEmitter<number>();

  public possibleMaxResults = [100, 1000, 10000];

  public onNewMaxResults(maxResults: number): void {
    this.newMaxResults.emit(maxResults);
  }

  public formatNumber(num: number): string {
    return num
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
