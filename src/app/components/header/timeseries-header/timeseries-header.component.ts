import { NgOptimizedImage, AsyncPipe } from '@angular/common';
import { Component, inject, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { DrawSelectorComponent } from '@components/shared/aoi-options/draw-selector/draw-selector.component';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { MapDrawModeType, MapInteractionModeType } from '@models';
import * as models from '@models';
import { ScreenSizeService, ThemingService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import { TimeseriesChartFlightDirectionToggleComponent } from '../../timeseries-chart/timeseries-chart-flight-direction-toggle/timeseries-chart-flight-direction-toggle.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';

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
