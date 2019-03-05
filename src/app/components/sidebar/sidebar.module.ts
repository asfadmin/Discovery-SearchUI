import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTabsModule, MatSelectModule, MatExpansionModule, MatButtonToggleModule } from '@angular/material';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { DateExtremaService } from '@services';

import { SidebarComponent } from './sidebar.component';

import { ToggleButtonModule } from './toggle-button';
import { SearchBarModule } from './search/search-bar';

import { PlatformSelectorModule } from './search/platform-selector';
import { FilterSelectorModule } from './search/filter-selector';
import { DateSelectorModule } from './search/date-selector';
import { PathSelectorModule } from './search/path-selector';
import { OtherSelectorModule } from './search/other-selector';
import { ListSearchModule } from './list-search';

import { GranulesListModule } from './granules/granules-list';
import { GranuleDetailComponent } from './granules/granule-detail/granule-detail.component';
import { LogoComponent } from './logo/logo.component';
import { MaxResultsSelectorComponent } from './search/max-results-selector/max-results-selector.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSelectModule,

    TruncateModule,
    FontAwesomeModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,

    MatSharedModule,
    PipesModule,

    SearchBarModule,
    ToggleButtonModule,
    GranulesListModule,
    ListSearchModule,

    FilterSelectorModule,
    PlatformSelectorModule,
    DateSelectorModule,
    PathSelectorModule,
    OtherSelectorModule,
  ],
  declarations: [
    SidebarComponent,
    GranuleDetailComponent,
    LogoComponent,
    MaxResultsSelectorComponent,
  ],
  providers: [
    DateExtremaService,
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
