import { Component, Input, OnInit } from '@angular/core';
import { SarviewsEvent } from '@models';

import * as models from '@models';
import * as sceneStore from '@store/scenes';

import { MapService } from '@services';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-sarviews-event',
  templateUrl: './sarviews-event.component.html',
  styleUrls: ['./sarviews-event.component.scss']
})
export class SarviewsEventComponent implements OnInit {
  @Input() event: SarviewsEvent

  public hovered = false;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public isSelected$ = this.store$.select(sceneStore.getSelectedSarviewsEvent).pipe(
    filter(event => !!event),
    map(sarviewsEvent => sarviewsEvent.event_id === this.event.event_id)
  )

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
    let coords = point.getCoordinates();
    this.mapService.panToEvent(coords);
    this.store$.dispatch(new sceneStore.SetSelectedSarviewsEvent(this.event.event_id));
  }

}
