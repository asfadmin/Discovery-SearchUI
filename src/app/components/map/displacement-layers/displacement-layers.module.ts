import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DisplacementLayersComponent } from './displacement-layers.component';
import { MapLegendComponent } from './map-legend/map-legend.component';
import { DocsModalModule } from '@components/shared/docs-modal';

import { MatSharedModule } from '@shared';
import { SharedModule } from "@shared";


@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSharedModule,
    SharedModule,
    DocsModalModule,
    MapLegendComponent
  ],
  declarations: [
    DisplacementLayersComponent
  ],
  exports: [
    DisplacementLayersComponent
  ]
})
export class DisplacementLayersModule { }
