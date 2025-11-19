import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ProductTypeSelectorModule } from '@components/shared/selectors/product-type-selector';
import { ShortNameSelectorModule } from '@components/shared/selectors/short-name-selector';

import { OtherSelectorComponent } from './other-selector.component';
import { BurstSelectorModule } from '../burst-selector';
import { SharedModule } from '@shared';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    ProductTypeSelectorModule,
    ShortNameSelectorModule,
    BurstSelectorModule,
    SharedModule,
    MatInputModule,
    OtherSelectorComponent,
  ],
  exports: [OtherSelectorComponent],
})
export class OtherSelectorModule {}
