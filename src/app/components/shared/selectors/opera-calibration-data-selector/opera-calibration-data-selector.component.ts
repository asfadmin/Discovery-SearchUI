import { Component, inject } from '@angular/core';
import {
  MatRadioChange,
  MatRadioGroup,
  MatRadioButton,
} from '@angular/material/radio';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { AppState } from '@store';
import * as filterStore from '@store/filters';

@Component({
  selector: 'app-opera-calibration-data-selector',
  templateUrl: './opera-calibration-data-selector.component.html',
  styleUrls: ['./opera-calibration-data-selector.component.scss'],
  imports: [MatRadioGroup, MatRadioButton, TranslateModule],
})
export class OperaCalibrationDataSelectorComponent {
  private store$ = inject<Store<AppState>>(Store);

  public useCalibrationData = this.store$.selectSignal(
    filterStore.getUseCalibrationData,
  );

  public onToggle(event: MatRadioChange): void {
    this.store$.dispatch(new filterStore.setUseCalibrationData(event.value));
  }
}
