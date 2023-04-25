import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner, fas } from '@fortawesome/free-solid-svg-icons';

import { MaxResultsSelectorComponent } from './max-results-selector.component';
import { ApiLinkDialogComponent } from './api-link-dialog/api-link-dialog.component';
import { ClipboardModule } from 'ngx-clipboard';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [MaxResultsSelectorComponent, ApiLinkDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatSharedModule,
    MatDialogModule,
    ClipboardModule,
    SharedModule
  ],
  exports: [ MaxResultsSelectorComponent ],
})
export class MaxResultsSelectorModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faSpinner);
  }
}
