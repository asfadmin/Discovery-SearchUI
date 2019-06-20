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

  public layerTypes = models.MapLayerTypes;
  public layerType: models.MapLayerTypes;
  public viewTypes = models.MapViewType;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.store$.select(mapStore.getMapLayerType).subscribe(
      layerType => this.layerType = layerType
    );
  }

  public onNewProjection(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public onNewLayerType(layerType: models.MapLayerTypes): void {
    const action = layerType === models.MapLayerTypes.STREET ?
      new mapStore.SetStreetView() :
      new mapStore.SetSatelliteView();

    this.store$.dispatch(action);
  }
}
