import { Component, OnInit, Input } from '@angular/core';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';

import * as models from '@models';
import * as services from '@services';

import { LonLat } from '@models';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit {
  public view$ = this.store$.select(mapStore.getMapView);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);

  public layerTypes = models.MapLayerTypes;
  public layerType: models.MapLayerTypes;
  public viewTypes = models.MapViewType;
  public mousePos: LonLat;

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
  ) { }


  ngOnInit() {
    this.store$.select(mapStore.getMapLayerType).subscribe(
      layerType => this.layerType = layerType
    );
    this.mapService.mousePosition$.subscribe(mp => this.mousePos = mp);
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

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onNewDrawMode(mode: models.MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW));
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onClearAOI(): void {
    this.mapService.clearDrawLayer();
    this.store$.dispatch(new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW));
  }

  public zoomIn(): void {
    this.mapService.zoomIn();
  }

  public zoomOut(): void {
    this.mapService.zoomOut();
  }
}
