import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';

import { MissionSearchComponent } from './mission-search.component';

@NgModule({
  declarations: [
    MissionSearchComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
  ],
  exports: [
    MissionSearchComponent
  ]
})
export class MissionSearchModule { }
