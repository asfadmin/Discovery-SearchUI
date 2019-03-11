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

import { SearchSelectorModule } from './search/search-selector';
import { SearchModule } from './search';

import { GranulesListModule } from './granules/granules-list';
import { GranuleDetailComponent } from './granules/granule-detail/granule-detail.component';
import { LogoComponent } from './logo/logo.component';

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

    SearchModule,
    SearchSelectorModule,
  ],
  declarations: [
    SidebarComponent,
    GranuleDetailComponent,
    LogoComponent,
  ],
  providers: [
    DateExtremaService,
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
