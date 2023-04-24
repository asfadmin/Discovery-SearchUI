import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en' // locale-data for en

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AsfLanguageService } from "@services/asf-language.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  @Input() header: boolean;
  @Input() selected: string;

  // public languageNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });

  constructor(
    public translate: TranslateService,
    public language: AsfLanguageService,
  ) { }

  ngOnInit(): void {
    if (this.header === undefined) {
      this.header = false;
    }
  }

}
