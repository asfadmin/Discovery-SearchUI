import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

import { MatSelectModule } from '@angular/material/select';

import { SbasOverlapSelectorComponent } from './sbas-overlap-selector.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSelectModule,
    SharedModule,
    SbasOverlapSelectorComponent,
  ],
  exports: [SbasOverlapSelectorComponent],
})
export class SbasOverlapSelectorModule {}
