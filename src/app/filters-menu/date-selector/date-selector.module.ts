import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateSelectorComponent } from './date-selector.component';

@NgModule({
  declarations: [DateSelectorComponent],
  imports: [
    CommonModule
  ],
  exports: [ DateSelectorComponent ],
})
export class DateSelectorModule { }
