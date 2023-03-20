import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';

import { ProductTypeSelectorComponent } from './product-type-selector.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    ProductTypeSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatSharedModule,
    SharedModule

  ],
  exports: [
    ProductTypeSelectorComponent
  ]
})
export class ProductTypeSelectorModule { }
