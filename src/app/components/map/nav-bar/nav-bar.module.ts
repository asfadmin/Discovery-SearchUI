import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatBadgeModule, MatMenuModule, MatInputModule } from '@angular/material';

import { MatSharedModule } from '@shared';
import { NavBarComponent } from './nav-bar.component';

import { PlatformSelectorModule } from '@components/sidebar/search/dataset-search/platform-selector';
import { DateSelectorModule } from '@components/sidebar/search/dataset-search/date-selector';
import { AoiUploadModule  } from '@components/sidebar/search/dataset-search/aoi-upload';
import { PathSelectorModule } from '@components/sidebar/search/dataset-search/path-selector';
import { OtherSelectorModule } from '@components/sidebar/search/dataset-search/other-selector';

@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatSharedModule,

    PlatformSelectorModule,
    DateSelectorModule,
    AoiUploadModule,
    PathSelectorModule,
    OtherSelectorModule,
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
