import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-subscription-date-range',
  templateUrl: './subscription-date-range.component.html',
  styleUrls: ['./subscription-date-range.component.scss']
})
export class SubscriptionDateRangeComponent implements OnInit {
  public minDate: Date;
  public maxDate: Date;

  @Input() public startDate: Date;
  @Input() public endDate: Date;

  @Output() public newEnd = new EventEmitter<Date>();
  @Output() public newStart = new EventEmitter<Date>();

  constructor() { }

  ngOnInit(): void {
    this.minDate = models.sentinel_1.date.start;
    this.maxDate = this.addDays(new Date(), 179);
  }

  public onStartDateChange(date): void {
    this.newStart.emit(date);
  }

  public onEndDateChange(date): void {
    this.newEnd.emit(date);
  }

  private addDays(date: Date, numDays: number): Date {
    const d = new Date(date.valueOf());
    return new Date(d.setDate(d.getDate() + numDays));
  }
}
