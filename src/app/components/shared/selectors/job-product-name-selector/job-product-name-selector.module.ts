import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { JobProductNameSelectorComponent } from './job-product-name-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [JobProductNameSelectorComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatAutocompleteModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    JobProductNameSelectorComponent
  ]
})
export class JobProductNameSelectorModule { }
