import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatDatepickerModule, MatFormFieldModule,
  MatNativeDateModule, MatInputModule,
} from '@angular/material';

import { MatSharedModule } from '@shared';
import { DateSelectorComponent } from './date-selector.component';

@NgModule({
  declarations: [DateSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,

    MatSharedModule,
  ],
  exports: [ DateSelectorComponent ],
})
export class DateSelectorModule { }
