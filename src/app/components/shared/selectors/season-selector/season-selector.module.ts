import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSharedModule } from '@shared';

import { SeasonSelectorComponent } from './season-selector.component';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';

@NgModule({
  declarations: [SeasonSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,

    MatSharedModule,
    MatSlideToggleModule,
    MatSliderModule,

    DateSelectorModule,
  ],
  exports: [SeasonSelectorComponent]
})
export class SeasonSelectorModule { }
