import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';

import { NavButtonsComponent } from './nav-buttons.component';
import { PreferencesComponent } from './preferences/preferences.component';

@NgModule({
  declarations: [ NavButtonsComponent, PreferencesComponent ],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatSharedModule,
  ],
  exports: [ NavButtonsComponent ],
  entryComponents: [ PreferencesComponent ]
})
export class NavButtonsModule { }
