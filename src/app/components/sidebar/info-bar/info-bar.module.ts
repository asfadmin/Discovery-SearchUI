import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoBarComponent } from './info-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [InfoBarComponent],
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [InfoBarComponent]
})
export class InfoBarModule { }
