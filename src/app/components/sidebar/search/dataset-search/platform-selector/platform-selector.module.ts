import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatListModule, MatSelectModule } from '@angular/material';
import { MatSharedModule } from '@shared';
import { PlatformSelectorComponent } from './platform-selector.component';
import { PlatformComponent } from './platform/platform.component';


@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatSelectModule,
    MatSharedModule,
    MatListModule,
  ],
  declarations: [
    PlatformSelectorComponent,
    PlatformComponent
  ],
  exports: [ PlatformSelectorComponent, PlatformComponent ]
})
export class PlatformSelectorModule { }
