import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatSharedModule } from '@shared';

import { QueueModule } from './queue';
import { ProcessingQueueModule } from './processing-queue';
import { HeaderButtonsModule } from './header-buttons';

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
import { OnDemandUserSelectorModule} from '@components/shared/selectors/on-demand-user-selector';
import { LogoModule } from '@components/header/logo/logo.module';

import { HeaderComponent } from './header.component';
import { InfoBarComponent } from './info-bar/info-bar.component';
import { DatasetHeaderComponent } from './dataset-header/dataset-header.component';
import { TimeseriesHeaderComponent } from './timeseries-header/timeseries-header.component';
import { ListHeaderComponent } from './list-header/list-header.component';
import { BaselineHeaderComponent } from './baseline-header/baseline-header.component';
import { SarviewsHeaderComponent } from './sarviews-header/sarviews-header.component';
import { Hyp3HeaderComponent } from './hyp3-header/hyp3-header.component';
import { AoiFilterComponent } from './dataset-header/aoi-filter/aoi-filter.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MasterSceneSelectorModule } from '@components/shared/selectors/master-scene-selector';
import { CiSearchModule } from './info-bar/ci-search/ci-search.module';
import { SarviewsEventTypeSelectorModule } from '@components/shared/selectors/sarviews-event-type-selector';
import { Hyp3UrlModule } from '@components/shared/hyp3-url/hyp3-url.module';
import { SharedModule } from "@shared";
import { LanguageSelectorModule } from "@components/shared/selectors/language-selector/language-selector.module";
import { BurstSelectorModule } from '@components/shared/selectors/burst-selector';

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
    TimeseriesHeaderComponent  
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
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
    CiSearchModule,
    SarviewsEventSearchSelectorModule,
    SarviewsEventTypeSelectorModule,
    Hyp3UrlModule,
    SharedModule,
    LanguageSelectorModule,
    OnDemandUserSelectorModule,
    BurstSelectorModule
  ],
  exports: [
    HeaderComponent
  ],
})
export class HeaderModule { }
