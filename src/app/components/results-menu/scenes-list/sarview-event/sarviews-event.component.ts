import { Component, Input, OnInit } from '@angular/core';
import { SarviewsEvent, SarviewsQuakeEvent, SarviewsVolcanicEvent } from '@models';

import * as models from '@models';
import * as sceneStore from '@store/scenes';

import { MapService } from '@services';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as moment from 'moment';

@Component({
  selector: 'app-sarviews-event',
  templateUrl: './sarviews-event.component.html',
  styleUrls: ['./sarviews-event.component.scss']
})
export class SarviewsEventComponent implements OnInit {
  @Input() event: SarviewsEvent;
  @Input() selected: boolean;
  public hovered = false;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  constructor(private mapService: MapService,
    private store$: Store<AppState>,
              ) { }

  ngOnInit(): void {
  }

  public onSetFocused() {
    this.hovered = true;
  }

  public onClearFocused() {
    this.hovered = false;
  }

  public onSetSelected() {
    this.mapService.selectedSarviewEvent$.next(this.event.event_id);
    this.store$.dispatch(new sceneStore.SetSelectedSarviewsEvent(this.event.event_id));
  }

  public eventIDDisplay(): string {
    if (this.event.event_type.toLowerCase() === 'quake') {
      return 'USGS: ' + (this.event as SarviewsQuakeEvent).usgs_event_id;
    } else {
      return 'Smithsonian: ' + (this.event as SarviewsVolcanicEvent).smithsonian_event_id;
    }
  }

  public isActive(): boolean {
    const currentDate = moment(new Date()).startOf('day').toDate();

    if (!!this.event.processing_timeframe.end) {
      return currentDate <= moment(this.event.processing_timeframe.end).endOf('day').toDate();
    }

    return true;
  }

  public getEventIcon(): string {
    let eventIconName = this.event.event_type === 'quake' ? 'Earthquake' : 'Volcano';
    if(!this.isActive()) {
      eventIconName += '_inactive';
    }

    return '/assets/icons/' + eventIconName + '.svg';
  }

  public eventIcon(): string {
    const eventTypeIcon = this.event.event_type === 'quake' ? 'Earthquake' : 'Volcano';

    if (!this.isActive()) {
      return eventTypeIcon + '_inactive';
    }

    return eventTypeIcon;
  }

  // "Earthquake_inactive.svg
  public onZoomTo() {
    this.mapService.zoomToEvent(this.event);
  }

}
