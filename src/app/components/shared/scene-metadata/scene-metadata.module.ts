import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';
import { SceneMetadataComponent } from './scene-metadata.component';

@NgModule({
  declarations: [SceneMetadataComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    PipesModule,
    MatMenuModule,
  ],
  exports: [ SceneMetadataComponent ]
})
export class SceneMetadataModule { }
