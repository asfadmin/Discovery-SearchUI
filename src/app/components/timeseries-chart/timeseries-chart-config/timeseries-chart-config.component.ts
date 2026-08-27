import { Component, Output, EventEmitter, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { AppState } from '@store';
import * as chartsStore from '@store/charts';

@Component({
  selector: 'app-timeseries-chart-config',
  imports: [MatIconModule, MatButtonModule, MatCheckboxModule, TranslateModule],
  templateUrl: './timeseries-chart-config.component.html',
  styleUrl: './timeseries-chart-config.component.scss',
})
export class TimeseriesChartConfigComponent {
  private store$ = inject<Store<AppState>>(Store);

  public showLines = this.store$.selectSignal(chartsStore.getShowLines);
  public showLinearFit = this.store$.selectSignal(chartsStore.getShowLinearFit);
  @Output() public resetReferenceEvent = new EventEmitter();

  public onToggleLines(event: MatCheckboxChange) {
    if (event.checked) {
      this.store$.dispatch(chartsStore.showGraphLines());
    } else {
      this.store$.dispatch(chartsStore.hideGraphLines());
    }
  }
  public onToggleLinearFit(event: MatCheckboxChange) {
    if (event.checked) {
      this.store$.dispatch(chartsStore.showLinearFit());
    } else {
      this.store$.dispatch(chartsStore.hideLinearFit());
    }
  }

  public resetReference() {
    this.resetReferenceEvent.emit();
  }
}
