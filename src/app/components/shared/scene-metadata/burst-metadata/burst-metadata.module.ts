import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurstMetadataComponent } from './burst-metadata.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SceneMetadataModule } from '../scene-metadata.module';
import { SceneFileModule } from '@components/results-menu/scene-files/scene-file';
@NgModule({
  declarations: [
    BurstMetadataComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    SceneMetadataModule,
    SceneFileModule
  ],
  exports: [
    BurstMetadataComponent
  ]
})
export class BurstMetadataModule { }
