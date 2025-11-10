import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { ProductTypeSelectorComponent } from './product-type-selector.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    ProductTypeSelectorComponent,
  ],
  exports: [ProductTypeSelectorComponent],
})
export class ProductTypeSelectorModule {}
