import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { MatMenuModule } from '@angular/material';

import { PlatformSelectorModule } from '@components/sidebar/search/dataset-search/platform-selector';
import { DateSelectorModule } from '@components/sidebar/search/dataset-search/date-selector';
import { AoiUploadModule  } from '@components/sidebar/search/dataset-search/aoi-upload';
import { PathSelectorModule } from '@components/sidebar/search/dataset-search/path-selector';
import { OtherSelectorModule } from '@components/sidebar/search/dataset-search/other-selector';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { DetailedSearchSelectorModule } from '@components/sidebar/search/search-selector';
import { BreadcrumbListComponent } from './breadcrumb-list.component';
import { InfoBarModule} from '@components/sidebar/info-bar/info-bar.module';

@NgModule({
  declarations: [BreadcrumbListComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule,

    DetailedSearchSelectorModule,
    PlatformSelectorModule,
    DateSelectorModule,
    AoiUploadModule,
    PathSelectorModule,
    MaxResultsSelectorModule,
    OtherSelectorModule,
    InfoBarModule,
  ],
  exports: [BreadcrumbListComponent]
})
export class BreadcrumbListModule { }
