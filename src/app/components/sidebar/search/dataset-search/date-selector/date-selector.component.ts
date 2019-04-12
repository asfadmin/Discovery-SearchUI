import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

import { Platform, DateRangeExtrema } from '@models';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent {
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() seasonStart: number | null;
  @Input() seasonEnd: number | null;
  @Input() extrema: DateRangeExtrema;

  @Output() newStart = new EventEmitter<Date>();
  @Output() newEnd = new EventEmitter<Date>();
  @Output() newSeasonStart = new EventEmitter<number>();
  @Output() newSeasonEnd = new EventEmitter<number>();

  public onStartDateChange(e: MatDatepickerInputEvent<Date>) {
    this.newStart.emit(e.value);
  }

  public onEndDateChange(e: MatDatepickerInputEvent<Date>) {
    this.newEnd.emit(e.value);
  }

  public onSeasonStartChange(dayOfYear: number): void {
    this.newSeasonStart.emit(dayOfYear);
  }

  public onSeasonEndChange(dayOfYear: number): void {
    this.newSeasonEnd.emit(dayOfYear);
  }

  public dayOfYearFormat(dayOfYear: number | null): string {
    const date = new Date();
    date.setFullYear(2019);

    date.setMonth(0);
    date.setDate(0);
    const timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
    const dayMilli = 1000 * 60 * 60 * 24;
    const dayNumMilli = dayOfYear * dayMilli;
    date.setTime(timeOfFirst + dayNumMilli);

    return  date.toLocaleDateString('en-US', {
      month: 'numeric', day: 'numeric'
    });
  }
}
