import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material';

import { FilterSelectorComponent } from './filter-selector.component';
import { FilterIconComponent } from './filter-icon/filter-icon.component';

@NgModule({
  declarations: [
    FilterSelectorComponent,
    FilterIconComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ],
  exports: [ FilterSelectorComponent ],
})
export class FilterSelectorModule { }
