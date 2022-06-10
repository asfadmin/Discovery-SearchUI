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

@Pipe({
  name: 'shortDateSeason'
})
export class ShortDateSeasonPipe implements PipeTransform {
  transform(dayOfYear: number): string {
    const date = new Date();
    date.setFullYear(2019);

    date.setMonth(0);
    date.setDate(0);
    const timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
    const dayMilli = 1000 * 60 * 60 * 24;
    const dayNumMilli = dayOfYear * dayMilli;
    date.setTime(timeOfFirst + dayNumMilli);

    return  date.toLocaleDateString('en-US', {
      month: <'numeric'>'short', day: 'numeric'
    });
  }
}

