import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventProductSortSelectorComponent } from './event-product-sort-selector.component';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    EventProductSortSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [
    EventProductSortSelectorComponent
  ]
})
export class EventProductSortSelectorModule { }
