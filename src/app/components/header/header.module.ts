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
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatSharedModule } from '@shared';
import { HeaderComponent } from './header.component';

import { QueueModule } from './queue';
import { ProcessingQueueModule } from './processing-queue';
import { HeaderButtonsModule } from './header-buttons';
import { InfoBarComponent } from './info-bar/info-bar.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';
import { SearchButtonModule } from '@components/shared/search-button';
import { ClearButtonModule } from '@components/shared/clear-button';
import { PipesModule } from '@pipes';
import { SearchTypeSelectorModule } from '@components/shared/selectors/search-type-selector';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { JobStatusSelectorModule } from '@components/shared/selectors/job-status-selector';
import { JobProductNameSelectorModule } from '@components/shared/selectors/job-product-name-selector';
import { SarviewsEventSearchSelectorModule } from '@components/shared/selectors/sarviews-event-search-selector';
import { LogoModule } from '@components/header/logo/logo.module';
import { DatasetHeaderComponent } from './dataset-header/dataset-header.component';
import { ListHeaderComponent } from './list-header/list-header.component';
import { AoiFilterComponent } from './dataset-header/aoi-filter/aoi-filter.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BaselineHeaderComponent } from './baseline-header/baseline-header.component';
import { MasterSceneSelectorModule } from '@components/shared/selectors/master-scene-selector';
import { Hyp3HeaderComponent } from './hyp3-header/hyp3-header.component';
import { CreateSubscriptionModule } from './create-subscription/create-subscription.module';
import { CiSearchModule } from './info-bar/ci-search/ci-search.module';
import { SarviewsHeaderComponent } from './sarviews-header/sarviews-header.component';
import { SarviewsEventTypeSelectorModule } from '@components/shared/selectors/sarviews-event-type-selector';
@NgModule({
  declarations: [
    HeaderComponent,
    InfoBarComponent,
    DatasetHeaderComponent,
    ListHeaderComponent,
    AoiFilterComponent,
    BaselineHeaderComponent,
    Hyp3HeaderComponent,
    SarviewsHeaderComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSharedModule,
    MatAutocompleteModule,
    PipesModule,

    QueueModule,
    ProcessingQueueModule,

    SearchTypeSelectorModule,
    DatasetSelectorModule,
    DateSelectorModule,
    AoiOptionsModule,
    MaxResultsSelectorModule,
    SearchButtonModule,
    ClearButtonModule,
    HeaderButtonsModule,
    MasterSceneSelectorModule,
    LogoModule,
    ProjectNameSelectorModule,
    JobStatusSelectorModule,
    JobProductNameSelectorModule,
    CreateSubscriptionModule,
    CiSearchModule,
    SarviewsEventSearchSelectorModule,
    SarviewsEventTypeSelectorModule
  ],
  exports: [
    HeaderComponent
  ],
})
export class HeaderModule { }
