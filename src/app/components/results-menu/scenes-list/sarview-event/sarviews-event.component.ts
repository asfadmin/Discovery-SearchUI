import { Component, Input, OnInit } from '@angular/core';
import { SarviewsEvent, SarviewsQuakeEvent, SarviewsVolcanicEvent } from '@models';

import * as models from '@models';
import * as sceneStore from '@store/scenes';
import * as proj from 'ol/proj';

import { MapService } from '@services';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

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
    const point = this.mapService.getEventCoordinate(this.event.event_id);
    const coords = point.getCoordinates();
    const [lat, lon] = proj.toLonLat(coords, this.mapService.epsg());
    this.mapService.panToEvent({lat, lon});
    this.store$.dispatch(new sceneStore.SetSelectedSarviewsEvent(this.event.event_id));
  }

  public eventIDDisplay(): string {
    if (this.event.event_type.toLowerCase() === 'quake') {
      return 'usgs: ' + (this.event as SarviewsQuakeEvent).usgs_event_id;
    } else {
      return 'smithsonian: ' + (this.event as SarviewsVolcanicEvent).smithsonian_event_id;
    }
  }

}
