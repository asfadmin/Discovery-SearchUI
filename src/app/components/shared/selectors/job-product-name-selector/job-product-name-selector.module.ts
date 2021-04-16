import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip'
import { JobProductNameSelectorComponent } from './job-product-name-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [JobProductNameSelectorComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    JobProductNameSelectorComponent
  ]
})
export class JobProductNameSelectorModule { }
