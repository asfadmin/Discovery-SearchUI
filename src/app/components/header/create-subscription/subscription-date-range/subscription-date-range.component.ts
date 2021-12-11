import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '@services';

import * as models from '@models';
import * as moment from 'moment';

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

  constructor(private notificationService: NotificationService) { }

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

  public onStartDateError(): void {
    const min = new Date(this.minDate);
    const dayBefore = moment(min.setDate(min.getDate() - 1)).format('MMMM Do YYYY');

    this.notificationService.error(
      `subscription start date must be after ${dayBefore}`,
      'Invalid Start Date');
  }

  public onEndDateError(): void {
    this.notificationService.error(
      'subscription end date must be within 6 months of current date',
      'Invalid End Date');
  }

  private addDays(date: Date, numDays: number): Date {
    const d = new Date(date.valueOf());
    return new Date(d.setDate(d.getDate() + numDays));
  }
}
