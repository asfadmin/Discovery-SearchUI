import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatBadgeModule, MatMenuModule, MatInputModule, MatToolbarModule } from '@angular/material';

import { MatSharedModule } from '@shared';
import { NavBarComponent } from './nav-bar.component';

import { BreadcrumbListModule } from './breadcrumb-list';
import { NavButtonsModule } from './nav-buttons';

@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatSharedModule,

    BreadcrumbListModule ,
    NavButtonsModule,
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
