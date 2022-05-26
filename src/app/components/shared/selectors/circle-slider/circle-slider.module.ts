import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleSliderComponent } from './circle-slider.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    CircleSliderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    FlexLayoutModule,
  ],
  exports: [
    CircleSliderComponent
  ]
})
export class CircleSliderModule { }
