import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en' // locale-data for en

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  @Input() header: boolean;
  @Input() selected: string;
  @Output() selectedChange = new EventEmitter<string>();

  public languageNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    if (this.header === undefined) {
      this.header = false;
    }
  }
  public languageName( langName : string ) {
    return this.languageNamesInEnglish.of( langName );
  }

  public onProfileSelectionChange(language: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'language-selected',
      'language': language,
    });
    const languageCookie = 'Language';
    this.cookieService.set(languageCookie, language);
    this.translate.use(language)
    console.log('onProfileSelectionChange() Language cookie set to:', language);
    this.selectedChange.emit(language);
  }
  public onSelectionChange(language: string): void {
    const languageCookie = 'Language';
    this.cookieService.set(languageCookie, language);
    console.log('onSelectionChange Language cookie set to:', language);
    this.translate.use(language)
  }
}
