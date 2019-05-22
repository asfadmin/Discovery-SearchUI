import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatDatepickerModule, MatFormFieldModule,
  MatNativeDateModule, MatInputModule,
  MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import { MatSharedModule } from '@shared';

import { SeasonSelectorComponent } from './season-selector.component';

@NgModule({
  declarations: [SeasonSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,

    MatSharedModule,
    MatSlideToggleModule,
    MatSliderModule,
  ],
  exports: [SeasonSelectorComponent]
})
export class SeasonSelectorModule { }
