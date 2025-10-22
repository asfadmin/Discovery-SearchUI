import { Component, Input, inject } from '@angular/core';
import {
  SarviewsEvent,
  SarviewsQuakeEvent,
  SarviewsVolcanicEvent,
} from '@models';

import * as models from '@models';
import * as sceneStore from '@store/scenes';

import { MapService, ScreenSizeService } from '@services';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import moment from 'moment';

@Component({
    selector: 'app-sarviews-event',
    templateUrl: './sarviews-event.component.html',
    styleUrls: ['./sarviews-event.component.scss'],
    standalone: false
})
export class SarviewsEventComponent {
  private mapService = inject(MapService);
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  @Input() event: SarviewsEvent;
  @Input() selected: boolean;

  public hovered = false;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public onSetFocused() {
    this.hovered = true;
  }

  public onClearFocused() {
    this.hovered = false;
  }

  public onSetSelected() {
    if (!this.selected) {
      this.mapService.selectedSarviewEvent$.next(this.event.event_id);
      this.store$.dispatch(
        new sceneStore.SetSelectedSarviewsEvent(this.event.event_id),
      );
    }
  }

  public eventIDDisplay(): string {
    if (this.event.event_type.toLowerCase() === 'quake') {
      return 'USGS: ' + (this.event as SarviewsQuakeEvent).usgs_event_id;
    } else {
      return (
        'Smithsonian: ' +
        (this.event as SarviewsVolcanicEvent).smithsonian_event_id
      );
    }
  }

  public isActive(): boolean {
    const currentDate = moment(new Date()).startOf('day').toDate();

    if (this.event.processing_timeframe.end) {
      return (
        currentDate <=
        moment(this.event.processing_timeframe.end).endOf('day').toDate()
      );
    }

    return true;
  }

  public getEventIcon(): string {
    let eventIconName =
      this.event.event_type === 'quake' ? 'Earthquake' : 'Volcano';
    if (!this.isActive()) {
      eventIconName += '_inactive';
    }

    return '/assets/icons/' + eventIconName + '.svg';
  }

  public eventIcon(): string {
    const eventTypeIcon =
      this.event.event_type === 'quake' ? 'Earthquake' : 'Volcano';

    if (!this.isActive()) {
      return eventTypeIcon + '_inactive';
    }

    return eventTypeIcon;
  }

  // "Earthquake_inactive.svg
  public onZoomTo($event: Event) {
    this.mapService.zoomToEvent(this.event);

    if (this.selected) {
      $event.stopPropagation();
    }
  }
}
