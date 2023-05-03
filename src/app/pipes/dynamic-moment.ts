import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment/moment";
import { BehaviorSubject } from "rxjs";

@Pipe({
  name: 'dynamicMoment'
})
export class MomentPipe implements PipeTransform {
  /**
   * MomentPipe constructor
   * @param {TranslateService} translate
   */
  constructor(private translate: TranslateService) {
  }

  /**
   * Make moment dynamic
   * @param {string} value
   * @param {string} format
   * @returns {any}
   */
  transform(value: string, format?: string): any {
    // make the moment format configurable
    format = format ? format : 'MMMM Do YYYY';
    // get the initial value
    const initVal = moment(value).locale(moment.locale()).format(format);
    // insert the value into a new behaviour subject. If the language changes, the behaviour subject will be
    // updated
    const momentObs = new BehaviorSubject<string>(initVal);
    this.translate.onLangChange.subscribe(() => {
      // format the new date according to the new locale
      const val = moment(value).locale(moment.locale()).format(format);
      momentObs.next(val);
    });
    return momentObs; // needs to be piped into the async pipe
  }

}
