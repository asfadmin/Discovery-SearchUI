import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSharedModule } from '@shared/mat-shared.module';

import { PipesModule } from '@pipes';
import { ImageDialogComponent } from './image-dialog.component';

@NgModule({
  declarations: [ImageDialogComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    MatDialogModule,
    PipesModule,
  ],
  exports: [ImageDialogComponent],
  entryComponents: [ImageDialogComponent],
})
export class ImageDialogModule { }
