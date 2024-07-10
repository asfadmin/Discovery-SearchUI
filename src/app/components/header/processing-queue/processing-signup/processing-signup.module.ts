import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { ProcessingSignupComponent } from './processing-signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatChipsModule } from '@angular/material/chips';
import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { SharedModule } from '@shared';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [ProcessingSignupComponent],
  imports: [
    CommonModule,
    PipesModule,
    MatSharedModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    ProcessingSignupComponent
  ]
})
export class ProcessingSignupModule { }
