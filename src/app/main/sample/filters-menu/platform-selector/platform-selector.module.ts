import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule, MatListModule, MatIconModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlatformSelectorComponent } from './platform-selector.component';
import { PlatformComponent } from './platform/platform.component';


@NgModule({
  imports: [
    CommonModule,

    MatCardModule,
    MatListModule,
    MatIconModule,

    FontAwesomeModule,
  ],
  declarations: [
    PlatformSelectorComponent,
    PlatformComponent
  ],
  exports: [ PlatformSelectorComponent ]
})
export class PlatformSelectorModule { }
