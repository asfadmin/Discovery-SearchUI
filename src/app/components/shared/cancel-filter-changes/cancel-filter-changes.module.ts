import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { CancelFilterChangesComponent } from './cancel-filter-changes.component';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    CancelFilterChangesComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,
    MatMenuModule,
    SharedModule,
  ],
  exports: [
    CancelFilterChangesComponent
  ]
})
export class CancelFilterChangesModule { }
