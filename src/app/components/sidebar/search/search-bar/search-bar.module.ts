import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSharedModule } from '@shared';
import { MatMenuModule } from '@angular/material';

import { SearchBarComponent } from './search-bar.component';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatSharedModule,
    MaxResultsSelectorModule
  ],
  declarations: [ SearchBarComponent ],
  exports: [ SearchBarComponent ]
})
export class SearchBarModule { }
