import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from '@angular/material/input';

import { MatSharedModule } from '@shared';

import { OnDemandUserSelectorComponent } from './on-demand-user-selector.component';



@NgModule({
  declarations: [
    OnDemandUserSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSharedModule,
    MatInputModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    OnDemandUserSelectorComponent
  ]
})
export class OnDemandUserSelectorModule { }
