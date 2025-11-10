import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';
import { ScenesListHeaderComponent } from './scenes-list-header.component';
import { SharedModule } from '@shared';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonToggleModule,
    FontAwesomeModule,
    OnDemandAddMenuModule,
    SharedModule,
    ScenesListHeaderComponent,
  ],
  exports: [ScenesListHeaderComponent],
})
export class ScenesListHeaderModule {}
