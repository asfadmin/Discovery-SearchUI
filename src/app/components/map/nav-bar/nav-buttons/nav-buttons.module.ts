import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule, MatMenuModule, MatInputModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { NavButtonsComponent } from './nav-buttons.component';

@NgModule({
  declarations: [NavButtonsComponent],
  imports: [
    CommonModule,

    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatSharedModule,
  ],
  exports: [NavButtonsComponent],
})
export class NavButtonsModule { }
