import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared/mat-shared.module';

import { PipesModule } from '@pipes';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { ImageDialogComponent } from './image-dialog.component';
import { BrowseListComponent } from './browse-list/browse-list.component';

@NgModule({
  declarations: [ImageDialogComponent, BrowseListComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    MatSharedModule,
    MatDialogModule,
    MatMenuModule,
    PipesModule,
    SceneMetadataModule,
  ],
  exports: [ImageDialogComponent],
  entryComponents: [ImageDialogComponent],
})
export class ImageDialogModule { }
