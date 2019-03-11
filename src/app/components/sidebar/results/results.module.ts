import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PipesModule } from '@pipes';
import { MatSharedModule } from '@shared';

import { GranulesListModule } from './granules-list';
import { SpreadsheetModule } from './spreadsheet';
import { GranuleDetailComponent } from './granule-detail/granule-detail.component';

@NgModule({
  declarations: [
    ResultsComponent,
    GranuleDetailComponent
  ],
  imports: [
    CommonModule,

    TruncateModule,
    FontAwesomeModule,

    MatSharedModule,
    PipesModule,

    SpreadsheetModule,
    GranulesListModule
  ],
  exports: [ResultsComponent],
})
export class ResultsModule { }
