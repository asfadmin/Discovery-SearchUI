import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { MatFormFieldModule } from '@angular/material/form-field';
import { DatasetSelectorModule } from '@components/shared/selectors/dataset-selector';

import { HeaderButtonsComponent } from './header-buttons.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { CustomizeEnvComponent } from './customize-env/customize-env.component';
import { OnlynumberDirective } from '@directives/onlynumber.directive';
import { SharedModule } from '@shared';
import { Hyp3UrlSelectorComponent } from './preferences/hyp3-url-selector/hyp3-url-selector.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LanguageSelectorModule } from '@components/shared/selectors/language-selector/language-selector.module';
import { DocsModalModule } from '@components/shared/docs-modal';
import { SearchButtonModule } from '@components/shared/search-button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    DatasetSelectorModule,
    MatFormFieldModule,
    SharedModule,
    LanguageSelectorModule,
    DocsModalModule,
    SearchButtonModule,
    MatAutocompleteModule,
    HeaderButtonsComponent,
    PreferencesComponent,
    CustomizeEnvComponent,
    OnlynumberDirective,
    Hyp3UrlSelectorComponent,
  ],
  exports: [HeaderButtonsComponent],
})
export class HeaderButtonsModule {}
