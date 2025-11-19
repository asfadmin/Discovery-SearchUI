import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { MasterSceneSelectorComponent } from './master-scene-selector.component';
import { SharedModule } from '@shared';
import { DatasetSelectorModule } from '../dataset-selector';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    SharedModule,
    DatasetSelectorModule,
    MatSlideToggleModule,
    MasterSceneSelectorComponent,
  ],
  exports: [MasterSceneSelectorComponent],
})
export class MasterSceneSelectorModule {}
