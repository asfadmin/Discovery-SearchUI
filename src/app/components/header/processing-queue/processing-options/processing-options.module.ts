import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSharedModule } from '@shared';

import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { ProcessingOptionsComponent } from './processing-options.component';
import { ToggleOptionComponent } from './toggle-option/toggle-option.component';
import { DropdownOptionComponent } from './dropdown-option/dropdown-option.component';
import { CheckboxOptionComponent } from './checkbox-option/checkbox-option.component';
import { SubsetOptionComponent } from './subset-option/subset-option.component';



@NgModule({
  declarations: [
    ProcessingOptionsComponent,
    ToggleOptionComponent,
    DropdownOptionComponent,
    CheckboxOptionComponent,
    SubsetOptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSharedModule,
    MatSlideToggleModule,
    ProjectNameSelectorModule
  ],
  exports: [
    ProcessingOptionsComponent
  ]
})
export class ProcessingOptionsModule { }
