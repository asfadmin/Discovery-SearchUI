import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathSelectorComponent } from './path-selector.component';

@NgModule({
  declarations: [PathSelectorComponent],
  imports: [
    CommonModule
  ],
  exports: [PathSelectorComponent],
})
export class PathSelectorModule { }
