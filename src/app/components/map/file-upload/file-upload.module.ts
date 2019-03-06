import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule, MatFormFieldModule, MatDialogModule,
  MatListModule, MatProgressBarModule, MatProgressSpinnerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSharedModule } from '@shared/mat-shared.module';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadDialogComponent } from './file-upload-dialog';

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
    MatProgressSpinnerModule,

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
