import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ResizableModule } from 'angular-resizable-element';

import { MatSharedModule } from '@shared';
import { SBASChartModule } from '@components/sbas-chart/sbas-chart.module';
import { SceneMetadataModule } from '@components/shared/scene-metadata';

import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header/scenes-list-header.module';

import { SbasSlidersComponent } from './sbas-sliders/sbas-sliders.component';
import { SbasSlidersTwoComponent } from './sbas-sliders-two/sbas-sliders-two.component';

import { SBASResultsMenuComponent } from './sbas-results-menu.component';

import { SharedModule } from "@shared";
import { DocsModalModule } from '@components/shared/docs-modal';


@NgModule({
  declarations: [
    SBASResultsMenuComponent,
    SbasSlidersComponent,
    SbasSlidersTwoComponent,
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    ReactiveFormsModule,
    FormsModule,
    ResizableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    SharedModule,
    SBASChartModule,
    SceneMetadataModule,
    ScenesListModule,
    ScenesListHeaderModule,
    DocsModalModule
  ],
  exports: [
    SBASResultsMenuComponent,
    SbasSlidersTwoComponent,
    SbasSlidersComponent,
  ]
})
export class SbasResultsMenuModule { }
