import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFiltersComponent } from './search-filters.component';

import { PipesModule } from '@pipes';
import { GeographicSearchFiltersComponent } from './geographic-search-filters/geographic-search-filters.component';
import { ListSearchFiltersComponent } from './list-search-filters/list-search-filters.component';
import { BaselineSearchFiltersComponent } from './baseline-search-filters/baseline-search-filters.component';
import { SbasSearchFiltersComponent } from './sbas-search-filters/sbas-search-filters.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [
    SearchFiltersComponent,
    GeographicSearchFiltersComponent,
    ListSearchFiltersComponent,
    BaselineSearchFiltersComponent,
    SbasSearchFiltersComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    SharedModule
  ],
  exports: [
    SearchFiltersComponent,
    GeographicSearchFiltersComponent,
    ListSearchFiltersComponent,
    BaselineSearchFiltersComponent,
    SbasSearchFiltersComponent
  ]
})
export class SearchFiltersModule { }
