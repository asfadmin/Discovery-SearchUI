import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule,
  MatButtonModule
} from '@angular/material';

import { PlatformSelectorComponent } from './platform-selector.component';
import { PlatformComponent } from './platform/platform.component';


@NgModule({
  imports: [
    CommonModule,

    MatCardModule,
    MatButtonModule
  ],
  declarations: [ PlatformSelectorComponent, PlatformComponent ],
  exports: [ PlatformSelectorComponent ]
})
export class PlatformSelectorModule { }
