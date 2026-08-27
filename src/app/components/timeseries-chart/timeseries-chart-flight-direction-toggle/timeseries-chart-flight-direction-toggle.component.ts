import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { SubSink } from 'subsink';

import * as models from '@models';
import { Breakpoints } from '@models';
import { ScreenSizeService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-timeseries-chart-flight-direction-toggle',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatInputModule,
    FormsModule,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    MatMenuTrigger,
  ],
  templateUrl: './timeseries-chart-flight-direction-toggle.component.html',
  styleUrl: './timeseries-chart-flight-direction-toggle.component.scss',
})
export class TimeseriesChartFlightDirectionToggleComponent
  implements OnInit, OnDestroy
{
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  private subs = new SubSink();
  public flightDirection: models.FlightDirection =
    models.FlightDirection.ASCENDING;
  public FlightDirections = models.FlightDirection;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(filtersStore.getFlightDirections)
        .pipe(map((dir) => dir[0] ?? this.flightDirection))
        .subscribe((dir) => (this.flightDirection = dir)),
    );
  }

  public onToggle(): void {
    const outputDirection =
      this.flightDirection === this.FlightDirections.ASCENDING
        ? this.FlightDirections.DESCENDING
        : this.FlightDirections.ASCENDING;
    this.setFlightDirection(outputDirection);
  }

  public setFlightDirection(dir: models.FlightDirection): void {
    const action = new filtersStore.SetFlightDirections([
      dir as models.FlightDirection,
    ]);
    this.store$.dispatch(action);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
