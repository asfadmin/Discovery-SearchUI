import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SarviewsEventType } from '@models';
import { MatSelectChange } from '@angular/material/select';

import * as filterStore from '@store/filters';

@Component({
  selector: 'app-sarviews-event-type-selector',
  templateUrl: './sarviews-event-type-selector.component.html',
  styleUrls: ['./sarviews-event-type-selector.component.scss']
})
export class SarviewsEventTypeSelectorComponent implements OnInit {

  constructor(private store$: Store<AppState>) { }

  public eventTypes = [SarviewsEventType.FLOOD, SarviewsEventType.QUAKE, SarviewsEventType.VOLCANO];

  public onNewEventTypes(event: MatSelectChange) {
    const selectedEventNames = (event.value as string[]);
    const selectedEventTypes: SarviewsEventType[] = selectedEventNames.map(name => SarviewsEventType[name]);

    this.store$.dispatch(new filterStore.SetSarviewsEventTypes(selectedEventTypes));
  }

  ngOnInit(): void {
  }

}
