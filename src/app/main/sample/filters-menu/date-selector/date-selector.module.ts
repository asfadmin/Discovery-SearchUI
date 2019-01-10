import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
} from '@angular/material';

import { DateSelectorComponent } from './date-selector.component';

@NgModule({
  declarations: [DateSelectorComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  exports: [ DateSelectorComponent ],
})
export class DateSelectorModule { }
