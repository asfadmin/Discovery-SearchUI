import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ResizableModule } from 'angular-resizable-element';

import { SceneMetadataModule } from '@components/shared/scene-metadata';

import { ScenesListModule } from '../scenes-list';
import { ScenesListHeaderModule } from '../scenes-list-header/scenes-list-header.module';

import { SbasSlidersComponent } from './sbas-sliders/sbas-sliders.component';
import { SbasSlidersTwoComponent } from './sbas-sliders-two/sbas-sliders-two.component';

import { SBASResultsMenuComponent } from './sbas-results-menu.component';

import { SharedModule } from '@shared';
import { DocsModalModule } from '@components/shared/docs-modal';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ResizableModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonToggleModule,
    SharedModule,
    SceneMetadataModule,
    ScenesListModule,
    ScenesListHeaderModule,
    DocsModalModule,
    SBASResultsMenuComponent,
    SbasSlidersComponent,
    SbasSlidersTwoComponent,
  ],
  exports: [
    SBASResultsMenuComponent,
    SbasSlidersTwoComponent,
    SbasSlidersComponent,
  ],
})
export class SbasResultsMenuModule {}
