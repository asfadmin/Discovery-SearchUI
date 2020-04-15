import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSharedModule } from '@shared';

import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { SearchDropdownComponent } from './search-dropdown.component';

import { ListSearchModule } from './list-search';
import { DatasetSearchModule } from './dataset-search';
import { BaselineSearchModule } from './baseline-search';

import { SearchSelectorModule } from '@components/shared/selectors/search-selector';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatTabsModule,
    MatSharedModule,

    ListSearchModule,
    DatasetSearchModule,
    BaselineSearchModule ,
    SearchButtonModule,
    ClearButtonModule,
    MaxResultsSelectorModule,

    FlexLayoutModule,

    SearchSelectorModule,
  ],
  declarations: [
    SearchDropdownComponent,
  ],
  exports: [
    SearchDropdownComponent
  ]
})
export class SearchDropdownModule { }
