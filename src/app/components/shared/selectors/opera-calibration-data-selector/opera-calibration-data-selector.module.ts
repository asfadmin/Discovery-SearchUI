import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperaCalibrationDataSelectorComponent } from './opera-calibration-data-selector.component';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [OperaCalibrationDataSelectorComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    TranslateModule
  ],
  exports: [
    OperaCalibrationDataSelectorComponent
  ]
})
export class OperaCalibrationDataSelectorModule { }
