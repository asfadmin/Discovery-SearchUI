import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule, MatButtonModule } from '@angular/material';

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
    MatButtonModule,
  ],
  exports: [ FilterSelectorComponent ],
})
export class FilterSelectorModule { }
