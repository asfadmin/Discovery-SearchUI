import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material';

import { FilterSelectorComponent } from './filter-selector.component';

@NgModule({
  declarations: [
    FilterSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ],
  exports: [ FilterSelectorComponent ],
})
export class FilterSelectorModule { }
