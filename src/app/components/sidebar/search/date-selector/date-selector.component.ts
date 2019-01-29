import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

import { Platform } from '@models';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {
  @Input() startDate: Date;
  @Input() endDate: Date;

  @Input() startMin: Date;
  @Input() startMax: Date;

  @Input() endMin: Date;
  @Input() endMax: Date;

  @Output() newStart = new EventEmitter<Date>();
  @Output() newEnd = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
  }

  onStartDateChange(e: MatDatepickerInputEvent<Date>) {
    this.newStart.emit(e.value);
  }

  onEndDateChange(e: MatDatepickerInputEvent<Date>) {
    this.newEnd.emit(e.value);
  }
}
