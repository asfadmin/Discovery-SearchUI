import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSharedModule } from '@shared';

import { SearchButtonModule } from '@components/shared/search-button';
import { CancelFilterChangesModule } from '@components/shared/cancel-filter-changes';
import { ClearButtonModule } from '@components/shared/clear-button';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { FiltersDropdownComponent } from './filters-dropdown.component';

import { ListFiltersModule } from './list-filters';
import { DatasetFiltersModule } from './dataset-filters';
import { TimeseriesFiltersModule } from './timeseries-filters';
import { BaselineFiltersModule } from './baseline-filters';
import { SbasFiltersModule } from './sbas-filters';
import { CustomProductsFiltersModule } from './custom-products-filters';
import { SarviewsFiltersModule } from './sarviews-filters';
import { SearchSelectorModule } from '@components/shared/selectors/search-selector';

import {DocsModalModule} from '@components/shared/docs-modal';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatTabsModule,
    MatSharedModule,

    ListFiltersModule,
    DatasetFiltersModule,
    BaselineFiltersModule,
    SbasFiltersModule,
    CustomProductsFiltersModule,
    SarviewsFiltersModule,
    TimeseriesFiltersModule,
    SearchButtonModule,
    CancelFilterChangesModule,
    ClearButtonModule,
    MaxResultsSelectorModule,
    SharedModule,

    SearchSelectorModule,
    DocsModalModule,
  ],
  declarations: [
    FiltersDropdownComponent,
  ],
  exports: [
    FiltersDropdownComponent
  ]
})
export class FiltersDropdownModule { }
