import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';

import { HeaderButtonsComponent } from './header-buttons.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { CustomizeEnvComponent } from './customize-env/customize-env.component';
import { OnlynumberDirective } from '@directives/onlynumber.directive';

@NgModule({
  declarations: [
    HeaderButtonsComponent,
    PreferencesComponent,
    CustomizeEnvComponent,
    OnlynumberDirective
  ],
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
        MatFormFieldModule,
    ],
  exports: [ HeaderButtonsComponent ]
})
export class HeaderButtonsModule { }
