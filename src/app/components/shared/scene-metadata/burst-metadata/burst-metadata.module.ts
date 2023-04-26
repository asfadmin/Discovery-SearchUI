import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { BurstMetadataComponent } from './burst-metadata.component';
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  declarations: [
    BurstMetadataComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatMenuModule,
    MatSharedModule
  ],
  exports: [
    BurstMetadataComponent
  ]
})
export class BurstMetadataModule { }
