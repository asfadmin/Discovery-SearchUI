import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en'
import '@formatjs/intl-displaynames/locale-data/es'


import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import * as moment from 'moment';
import { Injectable } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import { Store } from "@ngrx/store";
const defaultLanguage = 'en';

@Injectable({
  providedIn: 'root'
})
export class AsfLanguageService {

  // @ts-ignore
  public languageNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });
  public browserLang: string;
  private defaultProfileLanguage: string;
  public languageCookie = 'Language';
  public cookieOptions = {
    path: '/'
  };
  private matchLanguagesRegex = /en|es|de/;
  private listLanguagesRegex = [ 'en', 'es', 'de' ];

  public languageName = {
    'de' : 'Deutsch',
    'en' : 'English',
    'es' : 'Español' ,
    'fr' : 'Français',
    'pt' : 'Português',
    'zh' : '中文 (Chinese)',
  }

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService,
    private dateAdapter: DateAdapter<Date>,
    private store$: Store<AppState>,
  ) {
    this.browserLang = this.translate.getBrowserLang();
    this.initialize();
  }

  public setProfileLanguage(language: string): void {
    this.defaultProfileLanguage = language;
  }

  private setCurrentLanguage(language: string): void {
    this.store$.dispatch(new uiStore.SetCurrentLanguage(language));
  }

  public getName( langName? : string ) {
    if (!langName) {
      if (this.translate.currentLang) {
        return  this.languageName[this.translate.currentLang];
      } else {
        moment.locale(defaultLanguage);
        this.translate.use(defaultLanguage)
        return this.languageName[defaultLanguage];
      }
    }
    return this.languageName[langName];
  }

  public getEnglishName( langName : string ) {
    return this.languageNamesInEnglish.of( langName );
  }

  public setCurrent(language: string): void {
    this.cookieService.set(this.languageCookie, language, this.cookieOptions);
    moment.locale(language);
    this.translate.use(language);
    this.dateAdapter.setLocale(language);
    this.setCurrentLanguage(language);
  }

  public initialize(): void {
    this.translate.addLangs(this.listLanguagesRegex);
    this.translate.setDefaultLang(defaultLanguage);
    // If the browser reports a language we support and if so use it as the current language
    let currentLanguage = this.browserLang.match(this.matchLanguagesRegex) ? this.browserLang : defaultLanguage;
    // If the user has a profile and established a language preference then set the current language to it
    if (this.defaultProfileLanguage !== undefined) {
      currentLanguage = this.defaultProfileLanguage;
    }
    // If a language cookie exists, override the current language with it.
    // Else, set a language cookie to the current language
    const cookieExists: boolean = this.cookieService.check(this.languageCookie);
    if (cookieExists) {
      let cookieLanguage = this.cookieService.get(this.languageCookie);
      if (cookieLanguage.match(this.matchLanguagesRegex)) {
        currentLanguage = cookieLanguage;
      }
    }
    // Use the current language for the translation target
    this.setCurrent(currentLanguage);
  }
}
