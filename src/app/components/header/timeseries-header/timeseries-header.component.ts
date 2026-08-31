import { Component, inject, Signal, computed } from '@angular/core';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';
import * as filtersStore from '@store/filters';

import { ScreenSizeService, ThemingService } from '@services';
import { MapDrawModeType, MapInteractionModeType } from '@models';
import * as models from '@models';
import { NgOptimizedImage, AsyncPipe } from '@angular/common';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { DrawSelectorComponent } from '@components/shared/aoi-options/draw-selector/draw-selector.component';
import { TimeseriesChartFlightDirectionToggleComponent } from '../../timeseries-chart/timeseries-chart-flight-direction-toggle/timeseries-chart-flight-direction-toggle.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-timeseries-header',
  templateUrl: './timeseries-header.component.html',
  styleUrls: ['./timeseries-header.component.scss', '../header.component.scss'],
  imports: [
    SearchTypeSelectorComponent,
    DrawSelectorComponent,
    TimeseriesChartFlightDirectionToggleComponent,
    NgOptimizedImage,
    HeaderButtonsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class TimeseriesHeaderComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  private themingService = inject(ThemingService);

  public breakpoint = toSignal(this.screenSize.breakpoint$);
  public breakpoints = models.Breakpoints;
  public isDarkMode$ = this.themingService.theme$.pipe(
    map((theme) => theme === 'dark'),
  );
  public isKioskMode: Signal<boolean> = this.store$.selectSignal(
    searchStore.getKioskMode,
  );
  public flightDirections: Signal<models.FlightDirection[]> =
    this.store$.selectSignal(filtersStore.getFlightDirections);
  public flightDesc = computed(() => {
    return this.flightDirections().toString() == 'DESCENDING';
  });

  public onAddPointsMode(): void {
    this.store$.dispatch(
      new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW),
    );
    this.store$.dispatch(new mapStore.SetMapDrawMode(MapDrawModeType.POINT));
  }

  public onStopAddPoints(): void {
    this.store$.dispatch(
      new mapStore.SetMapInteractionMode(MapInteractionModeType.NONE),
    );
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }
}
