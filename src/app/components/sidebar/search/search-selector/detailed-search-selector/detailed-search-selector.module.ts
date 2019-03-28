import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailedSearchSelectorComponent } from './detailed-search-selector.component';

import { MatExpansionModule } from '@angular/material';

import { MatSharedModule } from '@shared';

@NgModule({
  declarations: [
    DetailedSearchSelectorComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSharedModule
  ],
  exports: [DetailedSearchSelectorComponent],
})
export class DetailedSearchSelectorModule { }
