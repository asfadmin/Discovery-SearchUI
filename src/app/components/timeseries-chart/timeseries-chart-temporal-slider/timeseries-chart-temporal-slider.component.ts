import {Component, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import * as noUiSlider from 'nouislider';
import { Store } from "@ngrx/store";
import { AppState } from "@store";
// import * as models from "@models";
// import {Observable, Subject} from 'rxjs';
// import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
// import * as filtersStore from "@store/filters";
import {SubSink} from "subsink";
// import {debounceTime, distinctUntilChanged} from "rxjs/operators";
// import wNumb from 'wnumb';
import * as filtersStore from '@store/filters';
import * as models from '@models';
// import moment from 'moment/moment';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
// import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-timeseries-chart-temporal-slider',
  standalone: true,
  templateUrl: './timeseries-chart-temporal-slider.component.html',
  styleUrls: ['./timeseries-chart-temporal-slider.component.scss']
})
export class TimeseriesChartTemporalSliderComponent implements OnInit, OnDestroy {
  @ViewChild('ts_slider', { static: true }) sliderRef: ElementRef;

  private subs = new SubSink();

  public tsSlider: noUiSlider.API;
  public timeSeriesSlider: { slider: noUiSlider.API; values$: Observable<number[]> };
  public maxRange: models.Range<any> = {start: Date.now.valueOf(), end: Date.now.valueOf()};
  public selectedRange: models.Range<any> = {start: Date.now.valueOf(), end: Date.now.valueOf()};
  public startDate$ = this.store$.select(filtersStore.getStartDate);
  public endDate$ = this.store$.select(filtersStore.getEndDate);
  public startDate: Date = new Date();
  public endDate: Date = new Date();



  constructor(
    private store$: Store<AppState>
  ){}

  ngOnInit() {

    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          this.maxRange = {start: temp.start, end: temp.end};
          this.selectedRange = {start: temp.start, end: temp.end};
          console.log('timeseries-chart-temporal-slider', this.maxRange);
          this.timeSeriesSlider = this.makeTimeSeriesSlider(this.sliderRef);
          console.log('**** this.timeSeriesSlider ****', this.timeSeriesSlider);
          this.subs.add(
            this.timeSeriesSlider.values$.subscribe(
              ([start, end]) => {
                console.log('*** timeseries-chart-temporal-slider selected range values$ ***', start, end);
                console.log('*** timeseries-chart-temporal-slider selected range types ***', typeof start, typeof end);
                if (start === this.selectedRange.start && end === this.selectedRange.end) {
                  return;
                }
                const action = new filtersStore.SetStartDate(new Date(start));
                this.store$.dispatch(action);
                const action2 = new filtersStore.SetEndDate(new Date(end));
                this.store$.dispatch(action2);

                this.timeSeriesSlider = this.makeTimeSeriesSlider(this.sliderRef);

              }
            )
          );
        }
      )
    );

    // this.subs.add(
    //   this.store$.select(filtersStore.getStartDate).subscribe(
    //     start => {
    //       this.startDate = start;
    //       if (this.lastRange !== this.perpRange) {
    //         this.lastRange = this.perpRange;
    //         this.perpendicularSlider.set([perp.start, perp.end]);
    //       }
    //     }
    //   )
    // );

    // this.subs.add(
    //   this.startDate$.subscribe(
    //     start => {
    //       this.startDate = start;
    //       if (this.endDate < this.startDate && !!this.endDate) {
    //         const endOfDay = this.endDateFormat(this.startDate);
    //         this.store$.dispatch(new filtersStore.SetEndDate(endOfDay));
    //       }
    //     }
    //   )
    // );
    //
    // this.subs.add(
    //   this.endDate$.subscribe(
    //     end => {
    //       this.endDate = end;
    //       if (this.startDate > this.endDate && !!this.startDate && !!this.endDate) {
    //         this.store$.dispatch(new filtersStore.SetStartDate(this.endDate));
    //       }
    //     }
    //   )
    // );


  }

  // public onStartDateChange(date): void {
  //     this.store$.dispatch(new filtersStore.SetStartDate(date));
  //   }
  //
  // public onEndDateChange(date): void {
  //     this.store$.dispatch(new filtersStore.SetEndDate(date));
  //   }
  //
  // private endDateFormat(date: Date | moment.Moment) {
  //     const endDate = moment(date).utc().endOf('day');
  //     return this.toJSDate(endDate);
  //   }


  private timestamp(str) {
    return new Date(str).getTime();
  }

  // Create a string representation of the date.
  public formatDate(date: any) :string {
    let fDateStr = date.toLocaleDateString()
    console.log('date, formatDate', date, fDateStr);
    return ( fDateStr );
  }

  public toFormat(value: any) {
    if (value == 0) return 0;
    return new Date(value).toLocaleDateString();
  }

  // private toJSDate(date: moment.Moment) {
  //   return date.toDate();
  // }

  // private isNumber(x: any): x is number {
  //   return typeof x === "number";
  // }

  public makeTimeSeriesSlider(filterRef: ElementRef): { slider: noUiSlider.API; values$: Observable<number[]> } {
    const self = this;
    const values$ = new Subject<number[]>();
    // Steps of one day
    const increment = 24 * 60 * 60 * 1000;
    let maxStart = this.maxRange.start ? this.maxRange.start.valueOf() : 0;
    let maxEnd = this.maxRange.end ? this.maxRange.end.valueOf() : 0;
    let selectedStart = this.selectedRange.start ? this.selectedRange.start.valueOf() : 0;
    let selectedEnd = this.selectedRange.end ? this.selectedRange.end.valueOf() : 0;
    if (maxStart != 0 && maxEnd != 0) {
      if (filterRef.nativeElement && filterRef.nativeElement.noUiSlider) { filterRef.nativeElement.noUiSlider.destroy(); }
      this.tsSlider = noUiSlider.create(filterRef.nativeElement, {
        start: [selectedStart, selectedEnd],
        behaviour: 'tap-drag',
        tooltips: [{to: (d) => self.toFormat(d)}, {to: (d) => self.toFormat(d)}],
        connect: true,
        step: increment,
        range: {
          'min': maxStart,
          'max': maxEnd
        },
        pips: {
          // @ts-ignore
          mode: 'count',
          values: 5,
          stepped: true,
          density: 4,
          format: {
            from: (value) => {return self.timestamp(value);},
            to: self.toFormat
          }
        },
      });

      this.tsSlider.on('update', (values: any[], _: any) => {
        console.log('*** timeseries-chart-temporal-slider values ***', values);
        values$.next(values.map(v => +v));
      });

      return {
        slider: this.tsSlider,
        values$: values$.asObservable().pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
      };
    }
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
