import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { ProductTypeSelectorModule } from '@components/shared/selectors/product-type-selector';
import { OtherSelectorComponent } from './other-selector.component';
import { BurstSelectorModule } from '../burst-selector';
import { SharedModule } from "@shared";
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ OtherSelectorComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSharedModule,
    ProductTypeSelectorModule,
    BurstSelectorModule,
    SharedModule,
    MatInputModule
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
