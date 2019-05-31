import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSharedModule } from '@shared';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

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
    FlexLayoutModule,
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
