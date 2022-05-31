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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSharedModule } from '@shared';


@NgModule({
  declarations: [
    CircleSliderComponent
  ],
  imports: [
    MatSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    CircleSliderComponent
  ]
})
export class CircleSliderModule { }
