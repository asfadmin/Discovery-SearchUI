import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSharedModule } from '@shared';
import { DatasetSelectorComponent } from './dataset-selector.component';
import { DatasetComponent } from './dataset/dataset.component';
import {MatBadgeModule} from '@angular/material/badge';
import {DocsModalModule} from '@components/shared/docs-modal';
import { SharedModule } from "@shared";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        MatMenuModule,
        MatSelectModule,
        MatListModule,
        MatSharedModule,
        MatBadgeModule,
        DocsModalModule,
        SharedModule
    ],
  declarations: [
    DatasetSelectorComponent,
    DatasetComponent
  ],
  exports: [ DatasetSelectorComponent, DatasetComponent ]
})
export class DatasetSelectorModule { }
