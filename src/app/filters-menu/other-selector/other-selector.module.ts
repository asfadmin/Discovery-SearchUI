import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherSelectorComponent } from './other-selector.component';

@NgModule({
  declarations: [ OtherSelectorComponent ],
  imports: [
    CommonModule
  ],
  exports: [ OtherSelectorComponent ],
})
export class OtherSelectorModule { }
