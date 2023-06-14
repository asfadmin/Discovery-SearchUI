import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { BurstMetadataComponent } from './burst-metadata.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    BurstMetadataComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatMenuModule,
    MatSharedModule,
    PipesModule,
    SharedModule
  ],
  exports: [
    BurstMetadataComponent
  ]
})
export class BurstMetadataModule { }
