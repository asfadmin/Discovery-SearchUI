import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material';

import { DateSelectorComponent } from './date-selector.component';

@NgModule({
  declarations: [DateSelectorComponent],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [ DateSelectorComponent ],
})
export class DateSelectorModule { }
