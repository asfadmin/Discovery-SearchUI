import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { CancelFilterChangesComponent } from './cancel-filter-changes.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatMenuModule,
    SharedModule,
    CancelFilterChangesComponent,
  ],
  exports: [CancelFilterChangesComponent],
})
export class CancelFilterChangesModule {}
