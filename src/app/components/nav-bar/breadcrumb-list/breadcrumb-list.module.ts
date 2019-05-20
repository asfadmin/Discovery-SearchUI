import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { MatMenuModule, MatDatepickerModule, MatInputModule, MatSelectModule } from '@angular/material';

import { PlatformSelectorModule } from '@components/shared/selectors/platform-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { AoiUploadModule } from '@components/shared/selectors/aoi-upload';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { SearchSelectorModule } from '@components/shared/selectors/search-selector';
import { BreadcrumbListComponent } from './breadcrumb-list.component';
import { InfoBarModule} from '@components/sidebar/info-bar/info-bar.module';

@NgModule({
  declarations: [BreadcrumbListComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatSharedModule,

    SearchSelectorModule,
    PlatformSelectorModule,
    DateSelectorModule,
    AoiUploadModule,
    MaxResultsSelectorModule,
    InfoBarModule,
  ],
  exports: [BreadcrumbListComponent]
})
export class BreadcrumbListModule { }
