import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSharedModule } from '@shared';
import { SearchBarComponent } from './search-bar.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,

    MatSharedModule,
  ],
  declarations: [ SearchBarComponent ],
  exports: [ SearchBarComponent ]
})
export class SearchBarModule { }
