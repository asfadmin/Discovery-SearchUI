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
import { AoiOptionsModule } from '@components/shared/aoi-options';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';
import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';

import { QueueModule, QueueComponent } from '@components/nav-bar/queue';
import { SearchSelectorModule } from '@components/shared/selectors/search-selector';
import { BreadcrumbListComponent } from './breadcrumb-list.component';
import { NavButtonsModule } from '@components/nav-bar/nav-buttons';
import { LogoModule } from '@components/nav-bar/logo/logo.module';

import { CustomBreakPointsProvider } from '@services/custom-breakpoints.ts';
import { InfoBarComponent } from '../info-bar/info-bar.component';

@NgModule({
  declarations: [BreadcrumbListComponent, InfoBarComponent],
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
    AoiOptionsModule,
    MaxResultsSelectorModule,
    SearchButtonModule,
    ClearButtonModule,
    NavButtonsModule,
    LogoModule,
  ],
  entryComponents: [
    QueueComponent
  ],
  exports: [BreadcrumbListComponent]
})
export class BreadcrumbListModule { }
