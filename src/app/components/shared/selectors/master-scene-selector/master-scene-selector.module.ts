import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { MatSharedModule } from '@shared';
import { MasterSceneSelectorComponent } from './master-scene-selector.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [MasterSceneSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSharedModule,
    SharedModule
  ],
  exports: [
    MasterSceneSelectorComponent
  ]
})
export class MasterSceneSelectorModule { }
