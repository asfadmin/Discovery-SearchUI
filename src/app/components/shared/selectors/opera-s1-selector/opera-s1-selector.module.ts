import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperaBurstIdSelectorComponent } from './opera-burst-id-selector/opera-burst-id-selector.component';
import { OperaS1SelectorComponent } from './opera-s1-selector.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSharedModule, SharedModule } from '@shared';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    OperaS1SelectorComponent,
    OperaBurstIdSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    MatSharedModule,
    SharedModule,
    MatSlideToggleModule
  ],
  exports: [
    OperaS1SelectorComponent,
    OperaBurstIdSelectorComponent
  ]
})
export class OperaS1SelectorModule { }
