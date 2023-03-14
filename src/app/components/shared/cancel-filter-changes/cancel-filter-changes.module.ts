import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { CancelFilterChangesComponent } from './cancel-filter-changes.component';

@NgModule({
  declarations: [
    CancelFilterChangesComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatButtonToggleModule,
    MatMenuModule,
  ],
  exports: [
    CancelFilterChangesComponent
  ]
})
export class CancelFilterChangesModule { }
