import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
} from '@angular/material';
import { MatSharedModule } from '../../mat-shared.module';

import { DateSelectorComponent } from './date-selector.component';

@NgModule({
  declarations: [DateSelectorComponent],
  imports: [
    CommonModule,

    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,

    MatSharedModule,
  ],
  exports: [ DateSelectorComponent ],
})
export class DateSelectorModule { }
