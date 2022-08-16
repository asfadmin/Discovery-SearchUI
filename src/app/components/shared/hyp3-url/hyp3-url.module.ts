import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Hyp3UrlComponent } from '@components/shared/hyp3-url/hyp3-url.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    Hyp3UrlComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,

  ],
  exports: [
    Hyp3UrlComponent
  ]
})
export class Hyp3UrlModule { }
