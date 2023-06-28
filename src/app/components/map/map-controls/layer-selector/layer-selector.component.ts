import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as mapStore from '@store/map';

import * as models from '@models';
import { MapService } from '@services';

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
  public coherenceLayerMonths: string | null = null;
  public months = [
    'DEC_JAN_FEB',
    'MAR_APR_MAY',
    'JUN_JUL_AUG',
    'SEP_OCT_NOV',
  ]

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
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

    this.subs.add(
      this.mapService.hasCoherenceLayer$.subscribe(
        months => this.coherenceLayerMonths = months
      )
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

  public onToggleCoherenceLayer(months: string): void {
    if (this.coherenceLayerMonths === months) {
      this.clearCoherenceLayer();
    } else {
      this.onSetCoherenceLayer(months);
    }
  }

  public onSetCoherenceLayer(months: string): void {
    this.mapService.setCoherenceLayer(months);
  }

  public clearCoherenceLayer(): void {
    this.mapService.clearCoherence();
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
