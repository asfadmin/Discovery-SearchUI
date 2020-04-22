import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSharedModule } from '@shared';

import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { FiltersDropdownComponent } from './filters-dropdown.component';

import { ListFiltersModule } from './list-filters';
import { DatasetFiltersModule } from './dataset-filters';
import { BaselineFiltersModule } from './baseline-filters';

import { SearchSelectorModule } from '@components/shared/selectors/search-selector';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatTabsModule,
    MatSharedModule,

    ListFiltersModule,
    DatasetFiltersModule,
    BaselineFiltersModule ,
    SearchButtonModule,
    ClearButtonModule,
    MaxResultsSelectorModule,

    FlexLayoutModule,

    SearchSelectorModule,
  ],
  declarations: [
    FiltersDropdownComponent,
  ],
  exports: [
    FiltersDropdownComponent
  ]
})
export class FiltersDropdownModule { }
