import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiltersMenuComponent } from './filters-menu.component';
import { SearchBarModule } from './search-bar';
import { PlatformSelectorModule } from './platform-selector';
import { FilterSelectorModule } from './filter-selector';

@NgModule({
  imports: [
    CommonModule,

    SearchBarModule,
    FilterSelectorModule,
    PlatformSelectorModule,
  ],
  declarations: [FiltersMenuComponent],
  exports: [FiltersMenuComponent]
})
export class FiltersMenuModule { }
