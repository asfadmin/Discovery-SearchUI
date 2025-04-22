import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import * as filtersStore from '@store/filters';
import * as models from '@models';
import { map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatInputModule} from '@angular/material/input';
import {DocsModalModule} from '@components/shared/docs-modal';
import {FormsModule} from '@angular/forms';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatTooltip} from '@angular/material/tooltip';
import {Breakpoints} from '@models';
import {ScreenSizeService} from '@services';
import {NgIf} from '@angular/common';


@Component({
    selector: 'app-timeseries-chart-flight-direction-toggle',
    imports: [TranslateModule, MatButtonModule, MatIconModule, MatButtonToggleModule, MatInputModule, DocsModalModule, FormsModule, MatMenu, MatMenuItem, MatTooltip, MatMenuTrigger, NgIf],
    templateUrl: './timeseries-chart-flight-direction-toggle.component.html',
    styleUrl: './timeseries-chart-flight-direction-toggle.component.scss'
})
export class TimeseriesChartFlightDirectionToggleComponent implements OnInit {
  private subs = new SubSink()
  public flightDirection: models.FlightDirection = models.FlightDirection.ASCENDING;
  public FlightDirections = models.FlightDirection;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  constructor(private store$: Store<AppState>,
    private screenSize: ScreenSizeService) {

  }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getFlightDirections).pipe(
        map(dir => dir[0] ?? this.flightDirection)
      ).subscribe(
        dir => this.flightDirection = dir
      )
    )

  }

  public onToggle(): void {
    const outputDirection = this.flightDirection === this.FlightDirections.ASCENDING ? this.FlightDirections.DESCENDING : this.FlightDirections.ASCENDING
    this.setFlightDirection(outputDirection);
  }

  public setFlightDirection(dir: models.FlightDirection): void {
    const action = new filtersStore.SetFlightDirections([<models.FlightDirection>dir]);
    this.store$.dispatch(action);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

