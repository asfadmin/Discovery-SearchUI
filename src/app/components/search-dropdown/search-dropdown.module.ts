import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSharedModule } from '@shared';

import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { SearchDropdownComponent } from './search-dropdown.component';

import { SearchSelectorModule } from '@components/shared/selectors/search-selector';
import { SearchModule } from './search';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatTabsModule,
    MatSharedModule,

    SearchButtonModule,
    ClearButtonModule,
    MaxResultsSelectorModule,

    FlexLayoutModule,

    SearchModule,
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
