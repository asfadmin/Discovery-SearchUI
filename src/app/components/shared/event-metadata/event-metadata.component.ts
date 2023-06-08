import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as moment from 'moment';
import * as filtersStore from '@store/filters';

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
    this.store$.dispatch(new filtersStore.SetStartDate(startDate));
  }

  public onSetEndDate(endDate: Date) {
    this.store$.dispatch(new filtersStore.SetEndDate(endDate));
  }

  public onSetStartMagnitude(startMagnitude: number) {
    this.store$.dispatch(new filtersStore.SetSarviewsMagnitudeStart(startMagnitude));
  }

  public onSetEndMagnitude(endMagnitude: number) {
    this.store$.dispatch(new filtersStore.SetSarviewsMagnitudeEnd(endMagnitude));
  }
}
