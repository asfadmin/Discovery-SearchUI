import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ProductTypeSelectorModule } from '@components/shared/selectors/product-type-selector';
import { ShortNameSelectorModule } from '@components/shared/selectors/short-name-selector';

import { ObservationPanelSelectorComponent } from './observation-panel-selector.component';
import { BurstSelectorModule } from '../burst-selector';
import { SharedModule } from '@shared';
import { MatInputModule } from '@angular/material/input';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    ProductTypeSelectorModule,
    ShortNameSelectorModule,
    BurstSelectorModule,
    SharedModule,
    MatInputModule,
    ObservationPanelSelectorComponent,
  ],
  exports: [ObservationPanelSelectorComponent],
})
export class ObservationPanelSelectorModule {}
