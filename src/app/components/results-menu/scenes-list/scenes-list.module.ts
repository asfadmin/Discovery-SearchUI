import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';

import { ScenesListComponent } from './scenes-list.component';
import { SceneModule } from './scene/scene.module';
import { PairComponent } from './pair/pair.component';
import { SarviewsEventComponent } from './sarview-event/sarviews-event.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    MatBadgeModule,
    MatChipsModule,
    TruncateModule,
    FontAwesomeModule,
    MatMenuModule,
    OnDemandAddMenuModule,
    SharedModule,
    SceneModule,
    ScenesListComponent,
    PairComponent,
    SarviewsEventComponent,
  ],
  exports: [ScenesListComponent],
})
export class ScenesListModule {}
