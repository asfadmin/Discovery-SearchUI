import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DisplacementLayersComponent } from './displacement-layers.component';
import { MapLegendComponent } from './map-legend/map-legend.component';
import { DocsModalModule } from '@components/shared/docs-modal';

import { SharedModule } from '@shared';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRadioModule,
    SharedModule,
    DocsModalModule,
    MapLegendComponent,
    CdkDrag,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    DisplacementLayersComponent,
  ],
  exports: [DisplacementLayersComponent],
})
export class DisplacementLayersModule {}
