import { Observable, of } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';

import translationsEN from '@i18n/en.json';
import translationsES from '@i18n/es.json';

type TranslationKeys = keyof typeof translationsEN;
type Translations = Record<TranslationKeys, string>;

export class StaticTranslateLoader implements TranslateLoader {
  private translations: Record<string, Translations> = {
    en: translationsEN,
    es: translationsES,
  };
  getTranslation(lang: string): Observable<Translations> {
    return of(this.translations[lang] ?? translationsEN);
  }
}
