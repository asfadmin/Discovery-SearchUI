import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en' // locale-data for en

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

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
  ) { }

  ngOnInit(): void {
    if (this.header === undefined) {
      this.header = false;
    }
  }
  public languageName( langName : string ) {
    return this.languageNamesInEnglish.of( langName );
  }

  public onSelectionChange(language: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'language-selected',
      'language': language,
    });
    this.translate.use(language)
    this.selectedChange.emit(language);
  }
}
