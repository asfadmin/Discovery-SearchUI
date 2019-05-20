import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatSelectModule, MatExpansionModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { PathSelectorModule } from '@components/shared/selectors/path-selector';
import { OtherSelectorModule } from '@components/shared/selectors/other-selector';

import { DatasetSearchComponent } from './dataset-search.component';

@NgModule({
  declarations: [
    DatasetSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PathSelectorModule,
    OtherSelectorModule,

    MatSelectModule,
    MatExpansionModule,
    MatSharedModule,
  ],
  exports: [
    DatasetSearchComponent,
  ],
})
export class DatasetSearchModule { }
