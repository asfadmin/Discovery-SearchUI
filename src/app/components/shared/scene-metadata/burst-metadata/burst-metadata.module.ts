import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurstMetadataComponent } from './burst-metadata.component';
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  declarations: [
    BurstMetadataComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule
  ],
  exports: [
    BurstMetadataComponent
  ]
})
export class BurstMetadataModule { }
