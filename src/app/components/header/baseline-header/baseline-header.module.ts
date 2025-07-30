import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {BaselineHeaderComponent} from "./baseline-header.component";
import { MatSharedModule, SharedModule } from "../../../shared";
// import { BaselineFrameReferenceToggleComponent } from '@components/shared/selectors/baseline-frame-reference-toggle';
@NgModule({
  declarations: [
    BaselineHeaderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSharedModule,
    // BaselineFrameReferenceToggleComponent
  ],
  exports: [
    BaselineHeaderComponent
  ]
})
export class BaselineHeaderModule { }
