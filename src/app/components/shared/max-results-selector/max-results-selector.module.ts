import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatSharedModule } from '@shared';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


import { MaxResultsSelectorComponent } from './max-results-selector.component';

@NgModule({
  declarations: [MaxResultsSelectorComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatMenuModule,
    MatSharedModule
  ],
  exports: [MaxResultsSelectorComponent]
})
export class MaxResultsSelectorModule {
  constructor() {
    library.add(faSpinner);
  }
}
