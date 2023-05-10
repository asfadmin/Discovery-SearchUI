import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPolygonSliderComponent } from './event-polygon-slider.component';
import { SharedModule} from "@shared";


@NgModule({
  declarations: [
    EventPolygonSliderComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    EventPolygonSliderComponent
  ]
})
export class EventPolygonSliderModule { }
