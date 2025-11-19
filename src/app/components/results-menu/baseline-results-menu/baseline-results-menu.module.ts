import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ResizableModule } from 'angular-resizable-element';

import { SceneDetailModule } from '../scene-detail';
import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header/scenes-list-header.module';
import { OnDemandAddMenuModule } from '@components/shared/on-demand-add-menu';

import { BaselineResultsMenuComponent } from './baseline-results-menu.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonToggleModule,
    ResizableModule,
    SharedModule,
    SceneDetailModule,
    ScenesListModule,
    ScenesListHeaderModule,
    OnDemandAddMenuModule,
    BaselineResultsMenuComponent,
  ],
  exports: [BaselineResultsMenuComponent],
})
export class BaselineResultsMenuModule {}
