import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPolygonSliderComponent } from './event-polygon-slider.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [CommonModule, SharedModule, EventPolygonSliderComponent],
  exports: [EventPolygonSliderComponent],
})
export class EventPolygonSliderModule {}
