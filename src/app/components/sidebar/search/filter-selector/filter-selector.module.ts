import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { FilterSelectorComponent } from './filter-selector.component';
import { FilterIconComponent } from './filter-icon/filter-icon.component';

@NgModule({
  declarations: [
    FilterSelectorComponent,
    FilterIconComponent,
  ],
  imports: [
    CommonModule,
    MatSharedModule
  ],
  exports: [ FilterSelectorComponent ],
})
export class FilterSelectorModule { }
