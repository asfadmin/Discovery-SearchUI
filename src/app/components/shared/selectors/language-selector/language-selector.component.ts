import '@formatjs/intl-displaynames/polyfill';
import '@formatjs/intl-displaynames/locale-data/en';
import '@formatjs/intl-displaynames/locale-data/es';

import { Component, Input, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AsfLanguageService } from '@services/asf-language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  translate = inject(TranslateService);
  language = inject(AsfLanguageService);

  @Input() header: boolean;
  @Input() selected: string;

  ngOnInit(): void {
    if (this.header === undefined) {
      this.header = false;
    }
  }
}
