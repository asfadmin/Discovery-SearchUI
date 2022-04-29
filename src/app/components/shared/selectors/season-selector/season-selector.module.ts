import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSharedModule } from '@shared';

import { SeasonSelectorComponent } from './season-selector.component';
import { CircleSliderModule} from '@components/shared/selectors/circle-slider/circle-slider.module';
@NgModule({
  declarations: [SeasonSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,

    MatSharedModule,
    MatSlideToggleModule,
    MatSliderModule,
    CircleSliderModule
  ],
  exports: [SeasonSelectorComponent]
})
export class SeasonSelectorModule { }
