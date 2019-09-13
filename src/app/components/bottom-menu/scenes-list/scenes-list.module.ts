import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatBadgeModule } from '@angular/material/badge';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { ScenesListComponent } from './scenes-list.component';


@NgModule({
  declarations: [
    ScenesListComponent,
  ],
  imports: [
    CommonModule,
    ScrollDispatchModule,
    MatBadgeModule,
    TruncateModule,
    FontAwesomeModule,
    CopyToClipboardModule,
    MatSharedModule,
    PipesModule,
  ],
  exports: [
    ScenesListComponent
  ]
})
export class ScenesListModule { }
