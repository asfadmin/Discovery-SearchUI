import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { SceneMetadataModule } from '@components/shared/scene-metadata';
import { EventMetadataModule } from '@components/shared/event-metadata';
import { ImageDialogModule } from './image-dialog';
import { SceneDetailComponent } from './scene-detail.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { EventPolygonSliderModule } from './event-polygon-slider';

@NgModule({
  declarations: [SceneDetailComponent],
    imports: [
        CommonModule,
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        FlexLayoutModule,
        TruncateModule,
        MatSharedModule,
        PipesModule,
        CopyToClipboardModule,
        ImageDialogModule,
        SceneMetadataModule,
        EventMetadataModule,
        MatButtonToggleModule,
        MatSliderModule,
        EventPolygonSliderModule
    ],
  exports: [SceneDetailComponent],
})
export class SceneDetailModule { }
