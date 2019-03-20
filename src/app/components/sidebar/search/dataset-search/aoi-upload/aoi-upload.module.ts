import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { AoiUploadComponent } from './aoi-upload.component';

@NgModule({
  declarations: [ AoiUploadComponent ],
  imports: [
    CommonModule,
    MatInputModule,
    MatMenuModule,
    MatSharedModule,
  ],
  exports: [
    AoiUploadComponent
  ]
})
export class AoiUploadModule { }
