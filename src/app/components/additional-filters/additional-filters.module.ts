import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSharedModule } from '@shared';

import { AdditionalFiltersComponent } from './additional-filters.component';

import { SearchSelectorModule } from '@components/shared/selectors/search-selector';
import { SearchModule } from './search';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatTabsModule,
    MatSharedModule,

    FlexLayoutModule,

    SearchModule,
    SearchSelectorModule,
  ],
  declarations: [
    AdditionalFiltersComponent,
  ],
  exports: [
    AdditionalFiltersComponent
  ]
})
export class AdditionalFiltersModule { }
