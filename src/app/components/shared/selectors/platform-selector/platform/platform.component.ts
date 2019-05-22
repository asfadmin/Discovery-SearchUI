import { Component, Input, Output, EventEmitter } from '@angular/core';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { Platform, DateRange } from '@models';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent {
  @Input() platform: Platform;
  @Input() isSelected: boolean;

  public detailedPlatformInfoIcon = faInfoCircle;

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
