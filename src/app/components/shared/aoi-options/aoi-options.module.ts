import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatSharedModule } from '@shared';

import { FileUploadModule } from './file-upload';
import { AoiOptionsComponent } from './aoi-options.component';
import { DrawSelectorComponent } from './draw-selector/draw-selector.component';
import { InteractionSelectorComponent } from './interaction-selector';


@NgModule({
  declarations: [
    AoiOptionsComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatSharedModule,
    FileUploadModule,
  ],
  exports: [
    AoiOptionsComponent,
    DrawSelectorComponent,
    InteractionSelectorComponent
  ]
})
export class AoiOptionsModule { }
