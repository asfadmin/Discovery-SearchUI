import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { ProductTypeSelectorComponent } from './product-type-selector.component';


@NgModule({
  declarations: [
    ProductTypeSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatSharedModule
  ],
  exports: [
    ProductTypeSelectorComponent
  ]
})
export class ProductTypeSelectorModule { }
