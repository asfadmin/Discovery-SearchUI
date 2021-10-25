import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SarviewsEventTypeSelectorComponent } from './sarviews-event-type-selector.component';



@NgModule({
  declarations: [
    SarviewsEventTypeSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  exports: [
    SarviewsEventTypeSelectorComponent
  ]
})
export class SarviewsEventTypeSelectorModule { }
