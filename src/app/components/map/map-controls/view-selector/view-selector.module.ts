import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSharedModule } from '@shared';

import { ViewSelectorComponent } from './view-selector.component';


@NgModule({
  declarations: [
    ViewSelectorComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    MatSharedModule,
  ],
  exports: [
    ViewSelectorComponent
  ]
})
export class ViewSelectorModule { }
