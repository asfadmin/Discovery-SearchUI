import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SarviewsEventMagnitudeSelectorComponent } from './sarviews-event-magnitude-selector.component';
import { MatSliderModule } from '@angular/material/slider';


@NgModule({
  declarations: [
    SarviewsEventMagnitudeSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule
  ],
  exports: [
    SarviewsEventMagnitudeSelectorComponent
  ]
})
export class SarviewsEventMagnitudeSelectorModule { }
