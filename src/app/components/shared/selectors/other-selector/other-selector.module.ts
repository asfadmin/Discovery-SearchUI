import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { ProductTypeSelectorModule } from '@components/shared/selectors/product-type-selector';
import { OtherSelectorComponent } from './other-selector.component';

@NgModule({
  declarations: [ OtherSelectorComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSharedModule,
    ProductTypeSelectorModule
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
