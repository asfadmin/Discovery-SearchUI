import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatCheckboxModule
} from '@angular/material';

import { PlatformSelectorComponent } from './platform-selector.component';
import { PlatformComponent } from './platform/platform.component';


@NgModule({
  imports: [
    CommonModule,

    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCheckboxModule,
  ],
  declarations: [
    PlatformSelectorComponent,
    PlatformComponent
  ],
  exports: [ PlatformSelectorComponent ]
})
export class PlatformSelectorModule { }
