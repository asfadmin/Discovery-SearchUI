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
export class MapControlsComponent {
  public view$ = this.store$.select(mapStore.getMapView);
  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);

  constructor(private store$: Store<AppState>) { }

  public onNewProjection(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }
}
