import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatSelectModule, MatExpansionModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { PathSelectorModule } from './path-selector';
import { PlatformSelectorModule } from './platform-selector';
import { DateSelectorModule } from './date-selector';
import { OtherSelectorModule } from './other-selector';
import { AoiUploadModule } from './aoi-upload';

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

    PlatformSelectorModule,
    DateSelectorModule,
    PathSelectorModule,
    OtherSelectorModule,
    AoiUploadModule,
  ],
  exports: [
    DatasetSearchComponent,
  ],
})
export class DatasetSearchModule { }
