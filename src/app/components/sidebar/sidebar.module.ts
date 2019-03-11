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
import { ResultsModule } from './results';

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
    ResultsModule,

    SearchModule,
    SearchSelectorModule,
  ],
  declarations: [
    SidebarComponent,
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
