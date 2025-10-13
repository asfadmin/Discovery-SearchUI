import { Component, Input, inject } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared';
import * as models from '@models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { PropertyService } from '@services';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-flight-direction-selector',
  standalone: true,
  imports: [
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    SharedModule,
    AsyncPipe
  ],
  templateUrl: './flight-direction-selector.component.html',
  styleUrl: './flight-direction-selector.component.scss'
})
export class FlightDirectionSelectorComponent {
  prop = inject(PropertyService);
  private store$ = inject<Store<AppState>>(Store);

  @Input() multiple = true;
  public flightDirections$ = this.store$.select(filtersStore.getFlightDirections);

  public flightDirections = []
  public flightDirectionTypes = models.flightDirections;
  public p = models.Props;

  public onNewFlightDirectionsSelected(directions: models.FlightDirection[]): void {
    this.store$.dispatch(new filtersStore.SetFlightDirections(directions));
  }
}
