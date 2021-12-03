import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';


@Pipe({
  name: 'fullDate'
})
export class FullDatePipe implements PipeTransform {
  transform(date: Date | moment.Moment): string {
    const dateUtc = moment.utc(date);

    return dateUtc.format('MMMM DD YYYY HH:mm:ss') + 'Z';
  }
}


@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform(date: Date | moment.Moment): string {
    const dateUtc = moment.utc(date);

    return dateUtc.format('MMM DD YYYY');
  }
}

@Pipe({
  name: 'shortDateTime'
})
export class ShortDateTimePipe implements PipeTransform {

  transform(date: Date | moment.Moment): string {
    const dateUtc = moment.utc(date);

    return dateUtc.format('MM/DD/YY, HH:mm:ss') + 'Z';
  }
}
