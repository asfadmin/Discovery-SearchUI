import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventProductsDateSelectorComponent } from './event-products-date-selector.component';
import { PipesModule } from '@pipes';
import { DateRangeModule } from '@components/shared/selectors/date-range/date-range.module'

@NgModule({
  declarations: [
    EventProductsDateSelectorComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    DateRangeModule
  ],
  exports: [
    EventProductsDateSelectorComponent
  ]
})
export class EventProductsDateSelectorModule { }
