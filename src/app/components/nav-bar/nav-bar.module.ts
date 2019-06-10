import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatSharedModule } from '@shared';
import { NavBarComponent } from './nav-bar.component';

import { QueueModule, QueueComponent } from './queue';
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
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatSharedModule,
    QueueModule,

    BreadcrumbListModule ,
    NavButtonsModule,
  ],
  entryComponents: [
    QueueComponent
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
