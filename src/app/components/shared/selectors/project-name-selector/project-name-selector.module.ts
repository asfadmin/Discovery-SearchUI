import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ProjectNameSelectorComponent } from './project-name-selector.component';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    SharedModule,
    ProjectNameSelectorComponent,
  ],
  exports: [ProjectNameSelectorComponent],
})
export class ProjectNameSelectorModule {}
