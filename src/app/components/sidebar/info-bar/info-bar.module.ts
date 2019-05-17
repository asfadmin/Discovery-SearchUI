import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoBarComponent } from './info-bar.component';

@NgModule({
  declarations: [InfoBarComponent],
  imports: [
    CommonModule
  ],
  exports: [InfoBarComponent]
})
export class InfoBarModule { }
