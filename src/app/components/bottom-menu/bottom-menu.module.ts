import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { ScenesListModule } from './scenes-list';
import { BottomMenuComponent } from './bottom-menu.component';
import { ProductsModule } from './products';
import { GranuleDetailModule } from './granule-detail';

@NgModule({
  declarations: [BottomMenuComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    TruncateModule,
    MatMenuModule,
    MatSharedModule,
    PipesModule,
    ScenesListModule,
    ProductsModule,
    GranuleDetailModule
  ],
  exports: [BottomMenuComponent],
})
export class BottomMenuModule { }
