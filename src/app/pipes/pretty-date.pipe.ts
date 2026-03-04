import { Pipe, PipeTransform } from '@angular/core';
import { DateRange } from '@models';

@Pipe({ name: 'prettyDateRange' })
export class PrettyDateRangePipe implements PipeTransform {
  transform(dateRange: DateRange): string {
    const { start, end } = dateRange;

    const startYear = start.getFullYear();
    const endYear = !end ? 'Present' : end.getFullYear();

    return startYear === endYear
      ? `${startYear}`.trim()
      : `${startYear} to ${endYear}`.trim();
  }
}
