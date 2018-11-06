import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiltersMenuComponent } from './filters-menu.component';
import { SearchBarModule } from './search-bar';

@NgModule({
  imports: [
    CommonModule,

    SearchBarModule,
  ],
  declarations: [FiltersMenuComponent],
  exports: [FiltersMenuComponent]
})
export class FiltersMenuModule { }
