import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subscription-filters',
  templateUrl: './subscription-filters.component.html',
  styleUrls: ['./subscription-filters.component.scss']
})
export class SubscriptionFiltersComponent implements OnInit {
  @Input() filters;
  @Output() loadSearch = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  public showSearchAreaType(polygon: string): string {
    return polygon.split('(')[0];
  }

  public onLoadSearch() {
    this.loadSearch.emit();
  }
}
