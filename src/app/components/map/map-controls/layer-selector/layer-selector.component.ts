import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as mapStore from '@store/map';

import * as models from '@models';

@Component({
  selector: 'app-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit {
  public layerTypes = models.MapLayerTypes;
  public layerType: models.MapLayerTypes;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(mapStore.getMapLayerType).subscribe(
        layerType => this.layerType = layerType
      )
    );
  }

  public onNewLayerType(layerType: models.MapLayerTypes): void {
    const action = layerType === models.MapLayerTypes.STREET ?
      new mapStore.SetStreetView() :
      new mapStore.SetSatelliteView();

    this.store$.dispatch(action);
  }
}
