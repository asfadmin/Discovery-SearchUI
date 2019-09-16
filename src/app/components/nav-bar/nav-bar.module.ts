import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatSharedModule } from '@shared';
import { NavBarComponent } from './nav-bar.component';

import { QueueModule, QueueComponent } from './queue';
import { NavButtonsModule } from './nav-buttons';
import { InfoBarComponent } from './info-bar/info-bar.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';
import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';

import { SearchSelectorModule } from '@components/shared/selectors/search-selector';
import { LogoModule } from '@components/nav-bar/logo/logo.module';

import { CustomBreakPointsProvider } from '@services/custom-breakpoints.ts';
import { SearchTypeSelectorComponent } from './search-type-selector/search-type-selector.component';
import { DatasetNavComponent } from './dataset-nav/dataset-nav.component';
import { ListNavComponent } from './list-nav/list-nav.component';
import { AoiFilterComponent } from './dataset-nav/aoi-filter/aoi-filter.component';

@NgModule({
  declarations: [
    NavBarComponent,
    InfoBarComponent,
    SearchTypeSelectorComponent,
    DatasetNavComponent,
    ListNavComponent,
    AoiFilterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,

    MatToolbarModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
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
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
