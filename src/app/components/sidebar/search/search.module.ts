import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { ListSearchModule, ListSearchComponent } from './list-search';
import { DatasetSearchModule, DatasetSearchComponent } from './dataset-search';
import { CompactSearchSelectorModule } from './search-selector';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    ListSearchModule,
    DatasetSearchModule,
    CompactSearchSelectorModule,
  ],
  exports: [
    SearchComponent
  ],
})
export class SearchModule { }
