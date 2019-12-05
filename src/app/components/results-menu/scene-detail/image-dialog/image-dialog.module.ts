import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule, MatButtonModule, MatIconModule } from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSharedModule } from '@shared/mat-shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PipesModule } from '@pipes';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { ImageDialogComponent } from './image-dialog.component';
import { BrowseListComponent } from './browse-list/browse-list.component';

@NgModule({
  declarations: [ImageDialogComponent, BrowseListComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    FlexLayoutModule,
    DragDropModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSharedModule,
    MatCheckboxModule,
    MatListModule,
    MatDialogModule,
    MatMenuModule,
    PipesModule,
    SceneMetadataModule,
  ],
  exports: [ImageDialogComponent],
  entryComponents: [ImageDialogComponent],
})
export class ImageDialogModule { }
