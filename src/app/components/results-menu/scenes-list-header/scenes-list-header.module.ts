import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatSharedModule } from '@shared';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
import { ScenesListHeaderComponent } from './scenes-list-header.component';


@NgModule({
  declarations: [
    ScenesListHeaderComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSharedModule,
    MatButtonToggleModule,
    FontAwesomeModule,
    OnDemandAddMenuModule,
  ],
  exports: [
    ScenesListHeaderComponent
  ]
})
export class ScenesListHeaderModule { }
