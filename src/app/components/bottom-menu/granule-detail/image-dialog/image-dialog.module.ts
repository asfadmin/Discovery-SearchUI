import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSharedModule } from '@shared/mat-shared.module';

import { ImageDialogComponent } from './image-dialog.component';

@NgModule({
  declarations: [ImageDialogComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    MatDialogModule,
  ],
  exports: [ImageDialogComponent],
  entryComponents: [ImageDialogComponent],
})
export class ImageDialogModule { }
