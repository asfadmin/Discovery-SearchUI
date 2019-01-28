import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule, MatFormFieldModule, MatDialogModule,
  MatListModule, MatProgressBarModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSharedModule } from '@shared/mat-shared.module';
import { FileUploadComponent, FileUploadDialogComponent  } from './file-upload.component';

@NgModule({
  declarations: [
    FileUploadComponent,
    FileUploadDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,


    MatSharedModule,
  ],
  entryComponents: [
    FileUploadDialogComponent
  ],
  exports: [
    FileUploadComponent,
  ]
})
export class FileUploadModule { }
