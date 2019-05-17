import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { SidebarComponent } from './sidebar.component';
import { ToggleButtonModule } from './toggle-button';
import { SearchBarModule } from './search/search-bar';

import { DetailedSearchSelectorModule } from './search/search-selector';
import { SearchModule } from './search';
import { RibbonModule } from './ribbon';

import { LogoComponent } from './logo/logo.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatTabsModule,
    MatSharedModule,

    SearchBarModule,
    ToggleButtonModule,
    RibbonModule,

    SearchModule,
    DetailedSearchSelectorModule,
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
