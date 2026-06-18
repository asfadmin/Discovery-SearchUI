import { Component, Input, inject } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import * as models from '@models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { PropertyService } from '@services';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IsRelevantPipe } from '@pipes/relevant.pipe';

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
