import { Component, Input } from '@angular/core';

import { Platform, DateRange } from '../../../models';

@Component({
  selector: 'app-platform',
  template: `
      <span class="float-left"><b>{{ platform.name }}</b></span>
      <span class="float-right">{{ prettyDateRange(platform.date) }}</span>
  `,
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent {
  @Input() platform: Platform;

  public isHovered = false;

  public hoverStart(e) {
    this.isHovered = true;
  }

  public hoverEnd(e) {
    this.isHovered = false;
  }

  public prettyDateRange(dateRange: DateRange): string {
    const { start, end } = dateRange;

    const startYear = start.getFullYear();
    const endYear = (!end) ? 'Present' : end.getFullYear();

    return `${startYear} to ${endYear}`;
  }

  public onSelected(e): void {
    console.log(e);
  }
}
