import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SarviewsEventActiveSelectorComponent } from './sarviews-event-active-selector.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    SarviewsEventActiveSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule
  ],
  exports: [
    SarviewsEventActiveSelectorComponent
  ],
})
export class SarviewsEventActiveSelectorModule { }
