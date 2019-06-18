import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';

import { PathSelectorModule } from '@components/shared/selectors/path-selector';
import { OtherSelectorModule } from '@components/shared/selectors/other-selector';
import { SeasonSelectorModule } from '@components/shared/selectors/season-selector';

import { DatasetSearchComponent } from './dataset-search.component';

@NgModule({
  declarations: [
    DatasetSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatSelectModule,
    MatExpansionModule,
    MatSharedModule,

    PathSelectorModule,
    OtherSelectorModule,
    SeasonSelectorModule,
  ],
  exports: [
    DatasetSearchComponent,
  ],
})
export class DatasetSearchModule { }
