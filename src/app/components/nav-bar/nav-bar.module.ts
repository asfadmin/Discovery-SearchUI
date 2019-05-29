import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatBadgeModule, MatMenuModule, MatInputModule, MatToolbarModule, MatProgressBarModule} from '@angular/material';

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
