import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
import {DownloadFileButtonModule} from '@components/shared/download-file-button/download-file-button.module';

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
        DownloadFileButtonModule,
    ],
  exports: [ImageDialogComponent],
})
export class ImageDialogModule { }
