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
import { ImageDialogModule } from './image-dialog';
import { SceneDetailComponent } from './scene-detail.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';

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
        MatButtonToggleModule,
        MatSliderModule
    ],
  exports: [SceneDetailComponent],
})
export class SceneDetailModule { }
