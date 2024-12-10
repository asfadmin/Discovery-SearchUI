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
@Component({
  selector: 'app-timeseries-chart-flight-direction-toggle',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule, MatButtonToggleModule],
  templateUrl: './timeseries-chart-flight-direction-toggle.component.html',
  styleUrl: './timeseries-chart-flight-direction-toggle.component.scss'
})
export class TimeseriesChartFlightDirectionToggleComponent implements OnInit {
  private subs = new SubSink()
  public flightDirection: models.FlightDirection = models.FlightDirection.ASCENDING;
  public FlightDirections = models.FlightDirection;
  constructor(private store$: Store<AppState>) {}

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

    const dir = outputDirection
      .toLowerCase();

    const capitalized = this.capitalizeFirstLetter(dir);

    const action = new filtersStore.SetFlightDirections([<models.FlightDirection>capitalized]);
    this.store$.dispatch(action);
  }
  private capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
