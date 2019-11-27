import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@pipes';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { NavButtonsComponent } from './nav-buttons.component';

@NgModule({
  declarations: [NavButtonsComponent],
  imports: [
    CommonModule,

    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatSharedModule,
    PipesModule,
  ],
  exports: [NavButtonsComponent],
})
export class NavButtonsModule { }
