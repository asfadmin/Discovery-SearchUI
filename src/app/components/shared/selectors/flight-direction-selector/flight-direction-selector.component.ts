import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import * as models from '@models';
import { IsRelevantPipe } from '@pipes/relevant.pipe';
import { PropertyService } from '@services';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-flight-direction-selector',
  imports: [
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    TranslateModule,
    AsyncPipe,
    IsRelevantPipe,
  ],
  templateUrl: './flight-direction-selector.component.html',
  styleUrl: './flight-direction-selector.component.scss',
})
export class FlightDirectionSelectorComponent {
  prop = inject(PropertyService);
  private store$ = inject<Store<AppState>>(Store);

  @Input() multiple = true;
  public flightDirections$ = this.store$.select(
    filtersStore.getFlightDirections,
  );
  public dataset = this.store$.selectSignal(filtersStore.getSelectedDataset);

  public flightDirections = [];
  public flightDirectionTypes = models.flightDirections;
  public p = models.Props;

  public onNewFlightDirectionsSelected(
    directions: models.FlightDirection[],
  ): void {
    this.store$.dispatch(new filtersStore.SetFlightDirections(directions));
  }
}
