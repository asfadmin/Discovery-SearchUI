import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GranuleDetailComponent } from './granule-detail.component';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';

@NgModule({
  declarations: [GranuleDetailComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    TruncateModule,
    MatSharedModule,
    PipesModule,
  ],
  exports: [GranuleDetailComponent],
})
export class GranuleDetailModule { }
