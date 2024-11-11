import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-timeseries-chart-temporal-slider',
  standalone: true,
  templateUrl: './timeseries-chart-temporal-slider.component.html',
  styleUrls: ['./timeseries-chart-temporal-slider.component.scss']
})
export class TimeseriesChartTemporalSliderComponent implements OnInit {
  @ViewChild('ts_slider', { static: true }) sliderRef: ElementRef;

  private subs = new SubSink();

  public slider;
  public maxRange: models.Range<any> = {start: Date.now.valueOf(), end: Date.now.valueOf()};
  // private firstLoad = true;



  constructor(
    private store$: Store<AppState>
  ){}

  ngOnInit() {
    this.subs.add(
      this.store$.select(filtersStore.getTemporalRange).subscribe(
        temp => {
          this.maxRange = {start: temp.start, end: temp.end};
          console.log('timeseries-chart-temporal-slider', this.maxRange);
          if (this.slider) { this.slider.destroy(); }
          this.makeDaysSlider(this.sliderRef);
        }
      )
    );

    // this.makeDaysSlider(this.sliderRef);
  }

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

  public makeDaysSlider(filterRef: ElementRef): void {
    const self = this;
    // Steps of one day
    const increment = 24 * 60 * 60 * 1000;
    this.slider = noUiSlider.create(filterRef.nativeElement, {
      start: [this.maxRange.start.valueOf(), this.maxRange.end.valueOf()],
      behaviour: 'tap-drag',
      tooltips: [{to: (d) => self.toFormat(d)}, {to: (d) => self.toFormat(d)}],
      connect: true,
      step: increment,
      range: {
        'min': this.maxRange.start.valueOf(),
        'max': this.maxRange.end.valueOf()
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
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
