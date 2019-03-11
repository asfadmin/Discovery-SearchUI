import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material';
import { MatSharedModule } from '@shared';

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

    MatTabsModule,
    MatSharedModule,

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
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
