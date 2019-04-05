import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatSharedModule } from '@shared';

import { AoiUploadComponent } from './aoi-upload.component';
import { DrawSelectorComponent } from './draw-selector/draw-selector.component';

@NgModule({
  declarations: [
    AoiUploadComponent,
    DrawSelectorComponent
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatMenuModule,
    MatSharedModule,
  ],
  exports: [
    AoiUploadComponent
  ]
})
export class AoiUploadModule { }
