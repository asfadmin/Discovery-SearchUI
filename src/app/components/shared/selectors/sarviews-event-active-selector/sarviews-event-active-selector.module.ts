import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SarviewsEventActiveSelectorComponent } from './sarviews-event-active-selector.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "@shared";

@NgModule({
  declarations: [
    SarviewsEventActiveSelectorComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    SarviewsEventActiveSelectorComponent
  ],
})
export class SarviewsEventActiveSelectorModule { }
