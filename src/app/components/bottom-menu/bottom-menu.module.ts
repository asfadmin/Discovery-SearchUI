import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { GranulesListModule } from './granules-list';
import { BottomMenuComponent } from './bottom-menu.component';
import { ProductsModule } from './products';
import { SceneDetailModule } from './scene-detail';

@NgModule({
  declarations: [BottomMenuComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    TruncateModule,
    MatMenuModule,
    MatSharedModule,
    PipesModule,
    GranulesListModule,
    ProductsModule,
    SceneDetailModule
  ],
  exports: [BottomMenuComponent],
})
export class BottomMenuModule { }
