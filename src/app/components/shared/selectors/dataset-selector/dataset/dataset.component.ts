import { Component, Input, Output, EventEmitter } from '@angular/core';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { Dataset, DateRange } from '@models';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent {
  @Input() dataset: Dataset;
  @Input() isSelected: boolean;

  public detailedDatasetInfoIcon = faInfoCircle;

  public onOpenHelp() {
    window.open(this.dataset.infoUrl);
  }

  public prettyDateRange(dateRange: DateRange): string {
    const { start, end } = dateRange;

    const startYear = start.getFullYear();
    const endYear = (!end) ? 'Present' : end.getFullYear();

    return `${startYear} to ${endYear}`;
  }

  public onInfoClicked(e: Event): void {
    e.stopPropagation();
  }
}
