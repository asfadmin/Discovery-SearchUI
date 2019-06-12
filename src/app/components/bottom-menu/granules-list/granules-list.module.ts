import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { GranulesListComponent } from './granules-list.component';


@NgModule({
  declarations: [
    GranulesListComponent,
  ],
  imports: [
    CommonModule,
    ScrollDispatchModule,
    TruncateModule,
    FontAwesomeModule,
    CopyToClipboardModule,

    MatSharedModule,
    PipesModule,
  ],
  exports: [
    GranulesListComponent
  ]
})
export class GranulesListModule { }
