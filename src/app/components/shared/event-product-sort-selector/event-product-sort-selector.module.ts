import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventProductSortSelectorComponent } from './event-product-sort-selector.component';

import { MatSelectModule } from '@angular/material/select'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    EventProductSortSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  exports: [
    EventProductSortSelectorComponent
  ]
})
export class EventProductSortSelectorModule { }
