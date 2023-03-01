import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';

import { ScenesListComponent } from './scenes-list.component';
import { SceneModule } from './scene/scene.module';
import { PairComponent } from './pair/pair.component';
import { SarviewsEventComponent } from './sarview-event/sarviews-event.component';


@NgModule({
  declarations: [
    ScenesListComponent,
    PairComponent,
    SarviewsEventComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatBadgeModule,
    MatChipsModule,
    TruncateModule,
    FontAwesomeModule,
    MatSharedModule,
    MatMenuModule,
    PipesModule,
    OnDemandAddMenuModule,
    SceneModule
  ],
  exports: [
    ScenesListComponent
  ]
})
export class ScenesListModule { }
