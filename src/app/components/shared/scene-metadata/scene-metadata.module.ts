import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';

import { SceneMetadataComponent } from './scene-metadata.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [CommonModule, MatMenuModule, SharedModule, SceneMetadataComponent],
  exports: [SceneMetadataComponent],
})
export class SceneMetadataModule {}
