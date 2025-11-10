import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSelectorComponent } from './search-selector.component';

import { MatExpansionModule } from '@angular/material/expansion';

import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    SharedModule,
    SearchSelectorComponent,
  ],
  exports: [SearchSelectorComponent],
})
export class SearchSelectorModule {}
