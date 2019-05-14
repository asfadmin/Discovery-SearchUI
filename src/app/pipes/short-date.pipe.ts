import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform(date: Date): string {
    const [month, day, year] = [
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCFullYear(),
    ];

    return `${month}-${day}-${year}`;
  }
}
