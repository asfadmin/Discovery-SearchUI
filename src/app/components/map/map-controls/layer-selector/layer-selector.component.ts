import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as mapStore from '@store/map';

import * as models from '@models';
import { MapService, ScreenSizeService } from '@services';

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
  public coherenceLayerMonths: string | null;
  public months = [
    'DEC_JAN_FEB',
    'MAR_APR_MAY',
    'JUN_JUL_AUG',
    'SEP_OCT_NOV',
  ]

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  private coherenceLayerOpacity: number;


  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private screenSize: ScreenSizeService,
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
        months => {
          this.coherenceLayerMonths = months;
        }
      )
    );

    this.subs.add(
      this.breakpoint$.subscribe(bp => this.breakpoint = bp)
    );
    this.subs.add(
      this.store$.select(mapStore.getCoherenceOverlayOpacity).subscribe(
        opacity => {
          this.coherenceLayerOpacity = opacity;
        }
      )
    )
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
    this.mapService.updateCoherenceOpacity(this.coherenceLayerOpacity);
  }

  public clearCoherenceLayer(): void {
    this.mapService.clearCoherence();
  }

  public onClickCoherenceMenu(): void {
    if (this.breakpoint === this.breakpoints.MOBILE) {
      return;
    }

    this.clearCoherenceLayer();
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
