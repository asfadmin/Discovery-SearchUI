import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en' // locale-data for en
import '@formatjs/intl-displaynames/locale-data/fr' // locale-data for fr

import { NgModule } from '@angular/core';
// import { TranslateModule}  from '@ngx-translate/core';
import { CommonModule } from "@angular/common";

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";

export function TranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (TranslateLoaderFactory),
        deps: [ HttpClient ]
      }
    })
  ],
  exports: [
    TranslateModule,
  ]
})
export class SharedModule { }
