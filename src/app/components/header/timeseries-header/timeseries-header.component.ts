import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';
import * as filtersStore from '@store/filters';

import { ScreenSizeService } from '@services';
import { MapDrawModeType, MapInteractionModeType } from '@models';
import * as models from '@models';

@Component({
  selector: 'app-timeseries-header',
  templateUrl: './timeseries-header.component.html',
  styleUrls: ['./timeseries-header.component.scss', '../header.component.scss'],
})
export class TimeseriesHeaderComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isDrawing = false;
  public flightDirections: models.FlightDirection[];
  public flightDesc = false;

  private subs = new SubSink();

  ngOnInit() {
    this.flightDesc = false;
    this.subs.add(
      this.store$
        .select(filtersStore.getFlightDirections)
        .subscribe((flightDirs) => {
          this.flightDirections = flightDirs;
          this.flightDesc = this.flightDirections.toString() == 'DESCENDING';
        }),
    );

    this.subs.add(
      this.store$
        .select(mapStore.getMapInteractionMode)
        .subscribe(
          (mode) => (this.isDrawing = mode === MapInteractionModeType.DRAW),
        ),
    );
  }

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

  public isKioskMode$ = this.store$.select(searchStore.getKioskMode);

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
