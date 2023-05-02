import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import * as moment from 'moment';
// import { MomentPipe } from "@pipes/dynamic-moment";


@Pipe({
  name: 'fullDate'
})
export class FullDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(date: Date | moment.Moment): string {
    const dateUtc = moment.utc(date);
    dateUtc.locale(this.translateService.currentLang);
    return dateUtc.format('MMMM DD YYYY HH:mm:ss') + 'Z';
  }
}


@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(date: Date | moment.Moment): string {
    const dateUtc = moment.utc(date);
    dateUtc.locale(this.translateService.currentLang);
    return dateUtc.format('MMM DD YYYY');
  }
}

@Pipe({
  name: 'shortDateTime'
})
export class ShortDateTimePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(date: Date | moment.Moment): string {
    const dateUtc = moment.utc(date);
    dateUtc.locale(this.translateService.currentLang);
    return dateUtc.format('L, HH:mm:ss') + 'Z';
  }
}

@Pipe({
  name: 'shortDateSeason'
})
export class ShortDateSeasonPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(dayOfYear: number): string {
    const date = new Date();
    date.setFullYear(2019);

    date.setMonth(0);
    date.setDate(0);
    const timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
    const dayMilli = 1000 * 60 * 60 * 24;
    const dayNumMilli = dayOfYear * dayMilli;
    date.setTime(timeOfFirst + dayNumMilli);

    return  date.toLocaleDateString(this.translateService.currentLang, {
      month: <'numeric'>'short', day: 'numeric'
    });
  }
}
