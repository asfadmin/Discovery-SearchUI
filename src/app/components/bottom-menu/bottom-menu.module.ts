import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { GranulesListModule } from './granules-list';
import { BottomMenuComponent } from './bottom-menu.component';
import { ProductsModule } from './products';

@NgModule({
  declarations: [BottomMenuComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    TruncateModule,
    MatSharedModule,
    PipesModule,
    GranulesListModule,
    ProductsModule,
  ],
  exports: [BottomMenuComponent],
})
export class BottomMenuModule { }
