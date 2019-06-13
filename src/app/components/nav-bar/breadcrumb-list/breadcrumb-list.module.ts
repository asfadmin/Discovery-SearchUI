import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatBadgeModule } from '@angular/material/badge';
import { MatSharedModule } from '@shared';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { AoiUploadModule } from '@components/shared/selectors/aoi-upload';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

import { QueueModule, QueueComponent } from '@components/nav-bar/queue';
import { SearchSelectorModule } from '@components/shared/selectors/search-selector';
import { BreadcrumbListComponent } from './breadcrumb-list.component';
import { NavButtonsModule } from '@components/nav-bar/nav-buttons';
import { LogoModule } from '@components/nav-bar/logo/logo.module';

@NgModule({
  declarations: [BreadcrumbListComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatSharedModule,
    QueueModule,

    SearchSelectorModule,
    DatasetSelectorModule,
    DateSelectorModule,
    AoiUploadModule,
    MaxResultsSelectorModule,
    NavButtonsModule,
    LogoModule,
  ],
  entryComponents: [
    QueueComponent
  ],
  exports: [BreadcrumbListComponent]
})
export class BreadcrumbListModule { }
