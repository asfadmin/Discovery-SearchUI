import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BurstSelectorComponent } from './burst-selector.component'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [BurstSelectorComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule
  ],
  exports: [
    BurstSelectorComponent
  ]
})
export class BurstSelectorModule { }
