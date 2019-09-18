import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { MaxResultsSelectorComponent } from './max-results-selector.component';
import { ApiLinkDialogComponent } from './api-link-dialog/api-link-dialog.component';
import { ClipboardModule } from 'ngx-clipboard';

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
    ClipboardModule
  ],
  exports: [ MaxResultsSelectorComponent ],
  entryComponents: [ ApiLinkDialogComponent ]
})
export class MaxResultsSelectorModule {
  constructor() {
    library.add(faSpinner);
  }
}
