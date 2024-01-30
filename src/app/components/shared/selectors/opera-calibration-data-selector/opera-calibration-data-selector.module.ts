import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperaCalibrationDataSelectorComponent } from './opera-calibration-data-selector.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [OperaCalibrationDataSelectorComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    TranslateModule
  ],
  exports: [
    OperaCalibrationDataSelectorComponent
  ]
})
export class OperaCalibrationDataSelectorModule { }
