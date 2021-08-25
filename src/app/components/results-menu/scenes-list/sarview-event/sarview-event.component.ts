import { Component, Input, OnInit } from '@angular/core';
import { SarviewsEvent } from '@models';

import * as models from '@models';
import * as sceneStore from '@store/scenes';

import { MapService } from '@services';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

@Component({
  selector: 'app-sarview-event',
  templateUrl: './sarview-event.component.html',
  styleUrls: ['./sarview-event.component.scss']
})
export class SarviewEventComponent implements OnInit {
  @Input() event: SarviewsEvent

  public hovered = false;
  public isSelected = false;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  constructor(private mapService: MapService,
    private store$: Store<AppState>,
              ) { }

  ngOnInit(): void {
    console.log(this.event);

  }

  public onSetFocused() {
    this.hovered = true;
  }

  public onClearFocused() {
    this.hovered = false;
  }

  public onSetSelected() {
    this.isSelected = true;
    this.mapService.selectedSarviewEvent$.next(this.event.event_id);
    const point = this.mapService.getEventCoordinate(this.event.event_id);
    let coords = point.getCoordinates();
    // coords = coords.map(val => +val);
    this.mapService.panToEvent(coords);
    this.store$.dispatch(new sceneStore.SetSelectedSarviewsEvent(this.event.event_id));
    // this.mapService.setCenter({lon: coords[0] / 360, lat: coords[1] / 180});
    // this.mapService.setZoom(5);
  }

}
