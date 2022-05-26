import { Component, OnInit, OnDestroy } from '@angular/core';

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
export class LayerSelectorComponent implements OnInit, OnDestroy {
  public overviewMapVisible$ = this.store$.select(mapStore.getIsOverviewMapOpen);
  public overviewMapVisible = false;

  public layerTypes = models.MapLayerTypes;
  public layerType: models.MapLayerTypes;

  public areGridlinesActive$ = this.store$.select(mapStore.getAreGridlinesActive);
  public gridActive = false;

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

    this.subs.add(
      this.overviewMapVisible$.subscribe(
        isOpen => this.overviewMapVisible = isOpen
      )
    );

    this.subs.add(
      this.areGridlinesActive$.subscribe(gridActive => {
        this.gridActive = gridActive;
      })
    );
  }

  public onNewLayerType(layerType: models.MapLayerTypes): void {
    const action = layerType === models.MapLayerTypes.STREET ?
      new mapStore.SetStreetView() :
      new mapStore.SetSatelliteView();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'new-layer-type',
      'new-layer-type': action.type
    });

    this.store$.dispatch(action);
  }

  public onToggleOverviewMap(isOpen: boolean): void {
    this.store$.dispatch(new mapStore.ToggleOverviewMap(!isOpen));
  }

  public onToggleGridlines() {
    this.store$.dispatch(new mapStore.SetGridlines(!this.gridActive));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
