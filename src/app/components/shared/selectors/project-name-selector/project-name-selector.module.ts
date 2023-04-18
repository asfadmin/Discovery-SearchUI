import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSharedModule } from '@shared';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ProjectNameSelectorComponent } from './project-name-selector.component';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [ProjectNameSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSharedModule,
    MatInputModule,
    MatAutocompleteModule,
    SharedModule
  ],
  exports: [
    ProjectNameSelectorComponent
  ]
})
export class ProjectNameSelectorModule { }
