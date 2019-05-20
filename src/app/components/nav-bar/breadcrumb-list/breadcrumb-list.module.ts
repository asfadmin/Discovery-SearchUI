import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { MatMenuModule } from '@angular/material';

import { PlatformSelectorModule } from '@components/shared/selectors/platform-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { AoiUploadModule  } from '@components/shared/selectors/aoi-upload';
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
    MaxResultsSelectorModule,
    InfoBarModule,
  ],
  exports: [BreadcrumbListComponent]
})
export class BreadcrumbListModule { }
