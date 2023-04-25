import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared/mat-shared.module';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadDialogComponent } from './file-upload-dialog';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    FileUploadComponent,
    FileUploadDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,

    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,

    MatSharedModule,
  ],
  exports: [
    FileUploadComponent,
    FileUploadDialogComponent
  ]
})
export class FileUploadModule { }
