import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSharedModule } from '@shared';
import { MatMenuModule, MatDatepickerModule, MatInputModule, MatSelectModule } from '@angular/material';

import { PlatformSelectorModule } from '@components/shared/selectors/platform-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { AoiUploadModule } from '@components/shared/selectors/aoi-upload';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { SearchSelectorModule } from '@components/shared/selectors/search-selector';
import { BreadcrumbListComponent } from './breadcrumb-list.component';
import { InfoBarModule} from '@components/sidebar/info-bar/info-bar.module';
import { LogoModule } from '@components/sidebar/logo/logo.module';

@NgModule({
  declarations: [BreadcrumbListComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
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
    LogoModule,
  ],
  exports: [BreadcrumbListComponent]
})
export class BreadcrumbListModule { }
