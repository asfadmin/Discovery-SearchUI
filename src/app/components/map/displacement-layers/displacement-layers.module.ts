import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DisplacementLayersComponent } from './displacement-layers.component';
import { DocsModalModule } from '@components/shared/docs-modal';

import { MatSharedModule } from '@shared';
import { SharedModule } from "@shared";


@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSharedModule,
    SharedModule,
    DocsModalModule,
  ],
  declarations: [
    DisplacementLayersComponent
  ],
  exports: [
    DisplacementLayersComponent
  ]
})
export class DisplacementLayersModule { }
