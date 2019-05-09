import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatDatepickerModule, MatFormFieldModule,
  MatNativeDateModule, MatInputModule,
  MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSharedModule } from '@shared';
import { DateSelectorComponent } from './date-selector.component';

@NgModule({
  declarations: [DateSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSliderModule,

    MatSharedModule,
  ],
  exports: [ DateSelectorComponent ],
})
export class DateSelectorModule { }
