import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';

@Component({
  selector: 'app-timeseries-header',
  templateUrl: './timeseries-header.component.html',
  styleUrls: ['./timeseries-header.component.scss',  '../header.component.scss']
})
export class TimeseriesHeaderComponent {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit() {
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }
}
