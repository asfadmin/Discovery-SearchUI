import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en' // locale-data for en
import '@formatjs/intl-displaynames/locale-data/fr' // locale-data for fr

import { NgModule } from '@angular/core';
import { TranslateModule}  from '@ngx-translate/core';
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    TranslateModule,
  ]
})
export class SharedModule { }
