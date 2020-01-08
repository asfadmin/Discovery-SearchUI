import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';
import { SavedSearchesModule, SavedSearchesComponent } from '@components/shared/saved-searches';

import { NavButtonsComponent } from './nav-buttons.component';
import { PreferencesComponent } from './preferences/preferences.component';

@NgModule({
  declarations: [ NavButtonsComponent, PreferencesComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatSharedModule,
    MatSelectModule,
    DatasetSelectorModule,
    SavedSearchesModule
  ],
  exports: [ NavButtonsComponent ],
  entryComponents: [
    PreferencesComponent,
    SavedSearchesComponent
  ]
})
export class NavButtonsModule { }
