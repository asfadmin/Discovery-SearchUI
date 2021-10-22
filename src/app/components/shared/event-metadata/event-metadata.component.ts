import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SetEndDate, SetStartDate } from '@store/filters';
import * as moment from 'moment';
// import { Moment } from 'moment';

@Component({
  selector: 'app-event-metadata',
  templateUrl: './event-metadata.component.html',
  styleUrls: ['./event-metadata.component.scss']
})
export class EventMetadataComponent implements OnInit {
  @Input() event: models.SarviewsEvent;
  @Input() eventType: models.SarviewsEventType;
  public eventTypes = models.SarviewsEventType;

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
  }

  public onSetStartDate(date: Date) {
    const startOf = moment(date).startOf('day');
    const startDate = startOf.toDate();
    this.store$.dispatch(new SetStartDate(startDate));
  }

  public onSetEndDate(date: Date) {
    this.store$.dispatch(new SetEndDate(date));
  }
}
