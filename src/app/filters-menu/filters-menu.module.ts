import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiltersMenuComponent } from './filters-menu.component';
import { SearchBarModule } from './search-bar';
import { PlatformSelectorModule } from './platform-selector';
import { FilterSelectorModule } from './filter-selector';
import { DateSelectorModule } from './date-selector';
import { PathSelectorModule } from './path-selector';
import { OtherSelectorModule } from './other-selector';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,

    SearchBarModule,

    FilterSelectorModule,
    PlatformSelectorModule,
    DateSelectorModule,
    PathSelectorModule,
    OtherSelectorModule,
  ],
  declarations: [FiltersMenuComponent],
  exports: [FiltersMenuComponent]
})
export class FiltersMenuModule { }
