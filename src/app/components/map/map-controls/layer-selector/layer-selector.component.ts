import { AsyncPipe } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatRadioButton } from '@angular/material/radio';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import * as models from '@models';
import { MapService, ScreenSizeService } from '@services';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';

@Component({
  selector: 'app-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss'],
  imports: [
    MatButton,
    MatMenuTrigger,

    MatIcon,
    MatMenu,
    MatMenuItem,
    MatDivider,
    MatCheckbox,

    MatRadioButton,
    AsyncPipe,
    TranslateModule,
  ],
})
export class LayerSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(MapService);
  private screenSize = inject(ScreenSizeService);

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public overviewMapVisible = this.store$.selectSignal(
    mapStore.getIsOverviewMapOpen,
  );

  public layerTypes = models.MapLayerTypes;
  public layerType = this.store$.selectSignal(mapStore.getMapLayerType);

  public gridActive = this.store$.selectSignal(mapStore.getAreGridlinesActive);
  public coherenceLayerMonths: string | null;
  public months = ['DEC_JAN_FEB', 'MAR_APR_MAY', 'JUN_JUL_AUG', 'SEP_OCT_NOV'];

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  private coherenceLayerOpacity: number;
  public priorityEnabled = false;

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.mapService.hasCoherenceLayer$.subscribe((months) => {
        this.coherenceLayerMonths = months;
      }),
    );

    this.subs.add(this.breakpoint$.subscribe((bp) => (this.breakpoint = bp)));
    this.subs.add(
      this.store$
        .select(mapStore.getCoherenceOverlayOpacity)
        .subscribe((opacity) => {
          this.coherenceLayerOpacity = opacity;
        }),
    );
  }

  public onNewLayerType(newLayerType: models.MapLayerTypes): void {
    const action =
      newLayerType === models.MapLayerTypes.STREET
        ? new mapStore.SetStreetView()
        : new mapStore.SetSatelliteView();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'new-layer-type',
      'new-layer-type': action.type,
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
    this.store$.dispatch(new mapStore.SetGridlines(!this.gridActive()));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
