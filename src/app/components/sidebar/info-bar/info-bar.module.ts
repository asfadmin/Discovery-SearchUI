import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoBarComponent } from './info-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaxResultsSelectorModule } from '@components/shared/max-results-selector';

@NgModule({
  declarations: [InfoBarComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaxResultsSelectorModule,
  ],
  exports: [InfoBarComponent]
})
export class InfoBarModule { }
