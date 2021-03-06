import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { JobProductNameSelectorComponent } from './job-product-name-selector.component';

@NgModule({
  declarations: [JobProductNameSelectorComponent],
  imports: [
    CommonModule,
    MatInputModule
  ],
  exports: [
    JobProductNameSelectorComponent
  ]
})
export class JobProductNameSelectorModule { }
