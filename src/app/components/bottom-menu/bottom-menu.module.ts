import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { GranulesListModule } from '@components/sidebar/results/granules-list';
import { BottomMenuComponent } from './bottom-menu.component';

@NgModule({
  declarations: [BottomMenuComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    TruncateModule,
    MatSharedModule,
    PipesModule,
    GranulesListModule,
  ],
  exports: [BottomMenuComponent],
})
export class BottomMenuModule { }
