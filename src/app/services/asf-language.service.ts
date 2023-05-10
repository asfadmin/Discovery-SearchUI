import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en' // locale-data for en

import { Injectable } from '@angular/core';

import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AsfLanguageService {

  // @ts-ignore
  public languageNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });
  public browserLang: string;
  private defaultProfileLanguage: any;

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService
  ) {
    this.browserLang = this.translate.getBrowserLang();
  }

  public getName( langName : string ) {
    return this.languageNamesInEnglish.of( langName );
  }

  public setCurrent(language: string): void {
    const languageCookie = 'Language';
    this.cookieService.set(languageCookie, language);
    this.translate.use(language)
  }

  public initialize(presets): void {
    this.defaultProfileLanguage = presets['Language'];
    this.translate.addLangs(['de', 'en', 'es', 'fr', 'pt', 'zh']);
    // const languageCookie = 'Language';
    const defaultLanguage = 'en';
    this.translate.setDefaultLang(defaultLanguage);

    this.defaultProfileLanguage = 'en';
    let currentLanguage = this.defaultProfileLanguage;


    // // If the browser reports a language we support and if so use it as the current language
    // let currentLanguage = this.browserLang.match(/de|en|es|fr/) ? this.browserLang : defaultLanguage;
    // // If the user has a profile and established a language preference then set the current language to it
    // if (this.defaultProfileLanguage !== undefined) {
    //   currentLanguage = this.defaultProfileLanguage;
    // }
    // // If a language cookie exists, override the current language with it.
    // // Else, set a language cookie to the current language
    // const cookieExists: boolean = this.cookieService.check(languageCookie);
    // if (cookieExists) {
    //   currentLanguage = this.cookieService.get('Language');
    // } else {
    //   this.cookieService.set(languageCookie, currentLanguage);
    // }
    // // Use the current language for the translation target
    this.translate.use(currentLanguage);

  }

  // public onProfileSelectionChange(language: string): void {
  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push({
  //     'event': 'language-selected',
  //     'language': language,
  //   });
  //   const languageCookie = 'Language';
  //   this.cookieService.set(languageCookie, language);
  //   this.translate.use(language)
  //   console.log('onProfileSelectionChange() Language cookie set to:', language);
  //   this.selectedChange.emit(language);
  // }

}
