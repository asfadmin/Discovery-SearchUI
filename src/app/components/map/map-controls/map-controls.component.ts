import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';

import * as models from '@models';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.css']
})
export class MapControlsComponent implements OnInit {

  public view$ = this.store$.select(mapStore.getMapView);
  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);

  public isDrawMenuDisabled$ = this.interactionMode$.pipe(
    map(mode => mode !== models.MapInteractionModeType.DRAW)
  );

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  public onNewProjection(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public onNewDrawMode(mode: models.MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }
}
