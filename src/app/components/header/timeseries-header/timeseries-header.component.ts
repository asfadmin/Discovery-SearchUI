import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';

import { ScreenSizeService } from '@services';
import { Breakpoints, MapDrawModeType, MapInteractionModeType } from '@models';

@Component({
  selector: 'app-timeseries-header',
  templateUrl: './timeseries-header.component.html',
  styleUrls: ['./timeseries-header.component.scss',  '../header.component.scss']
})
export class TimeseriesHeaderComponent implements OnInit, OnDestroy {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public isAddingPoints = false;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(mapStore.getMapInteractionMode).subscribe(
        mode => this.isAddingPoints = mode === MapInteractionModeType.DRAW
      )
    );

  }

  public onAddPointsMode(): void {
    console.log('points');
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
    this.store$.dispatch(new mapStore.SetMapDrawMode(MapDrawModeType.POINT));
  }

  public onStopAddPoints(): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.NONE));
  }


  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }

  public isKioskMode$ = this.store$.select(searchStore.getKioskMode);

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
