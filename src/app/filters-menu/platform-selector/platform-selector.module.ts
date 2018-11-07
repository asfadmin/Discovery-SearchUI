import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule, } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlatformSelectorComponent } from './platform-selector.component';
import { PlatformComponent } from './platform/platform.component';


@NgModule({
  imports: [
    CommonModule,

    MatCardModule,
    FontAwesomeModule,
  ],
  declarations: [
    PlatformSelectorComponent,
    PlatformComponent
  ],
  exports: [ PlatformSelectorComponent ]
})
export class PlatformSelectorModule { }
