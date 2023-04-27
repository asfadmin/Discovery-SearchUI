import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSharedModule } from '@shared/mat-shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PipesModule } from '@pipes';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { EventMetadataModule } from '@components/shared/event-metadata';
import { EventProductMetadataModule } from '@components/shared/event-product-metadata';
import { ImageDialogComponent } from './image-dialog.component';
import { BrowseListComponent } from './browse-list/browse-list.component';
import {DownloadFileButtonModule} from '@components/shared/download-file-button/download-file-button.module';
import { MatSliderModule } from '@angular/material/slider';
import { EventProductSortSelectorModule } from '@components/shared/event-product-sort-selector/event-product-sort-selector.module';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [ImageDialogComponent, BrowseListComponent],
    imports: [
        CommonModule,
        ScrollingModule,
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
        EventMetadataModule,
        EventProductMetadataModule,
        DownloadFileButtonModule,
        MatSliderModule,
        EventProductSortSelectorModule,
        SharedModule


    ],
  exports: [ImageDialogComponent],
})
export class ImageDialogModule { }
