import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';

import { MatSharedModule } from '@shared';
import { GranulesListModule } from '@components/sidebar/results/granules-list';
import { BottomMenuComponent } from './bottom-menu.component';

@NgModule({
  declarations: [BottomMenuComponent],
  imports: [
    CommonModule,
    TruncateModule,
    MatSharedModule,
    GranulesListModule,
  ],
  exports: [BottomMenuComponent],
})
export class BottomMenuModule { }
