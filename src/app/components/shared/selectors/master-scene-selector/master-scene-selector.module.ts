import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { MatSharedModule } from '@shared';
import { MasterSceneSelectorComponent } from './master-scene-selector.component';


@NgModule({
  declarations: [MasterSceneSelectorComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatSharedModule,
  ],
  exports: [
    MasterSceneSelectorComponent
  ]
})
export class MasterSceneSelectorModule { }
