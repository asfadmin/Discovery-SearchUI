import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '@services';

// import * as models from '@models';

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
    this.minDate = new Date();
    this.maxDate = this.addDays(new Date(), 179);
  }

  public onStartDateChange(date): void {
    this.newStart.emit(date);
  }

  public onEndDateChange(date): void {
    this.newEnd.emit(date);
  }

  public onStartDateError(): void {
    this.notificationService.error(
      'subscription must start on today\'s date or later',
      'Invalid Start Date');
  }

  public onEndDateError(): void {
    this.notificationService.error(
      'subscription end date must be within 6 months of start date',
      'Invalid End Date');
  }

  private addDays(date: Date, numDays: number): Date {
    const d = new Date(date.valueOf());
    return new Date(d.setDate(d.getDate() + numDays));
  }
}
