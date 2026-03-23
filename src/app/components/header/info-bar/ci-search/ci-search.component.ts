import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-ci-search',
  templateUrl: './ci-search.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./ci-search.component.scss'],
  standalone: true,
})
export class CiSearchComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private subs = new SubSink();
  private observer: MutationObserver;
  private currentLang = 'en';

  private noResultsTranslations: Record<string, string> = {
    en: 'No results found. If you are searching for data, use Vertex at https://search.asf.alaska.edu',
    es: 'No se encontraron resultados. Si está buscando datos, use Vertex en https://search.asf.alaska.edu',
  };

  constructor() {
    this.showSearch();
    this.observeNoResults();
  }

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(uiStore.getCurrentLanguage)
        .subscribe((currentLanguage) => {
          this.currentLang = currentLanguage || 'en';
        }),
    );
  }

  public showSearch() {
    const id = 'b8df7ea0-38a5-11eb-9b20-0242ac130002';

    (window as any)._overwriting_er_config = {
      lang: {
        translations: {
          en: {
            common: {
              no_results_found: this.noResultsTranslations['en'],
            },
          },
          es: {
            common: {
              no_results_found: this.noResultsTranslations['es'],
            },
          },
        },
      },
    };

    const ci_search = document.createElement('script');
    ci_search.type = 'text/javascript';
    ci_search.async = true;
    ci_search.src = 'https://cse.expertrec.com/api/js/ci_common.js?id=' + id;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ci_search, s);
  }

  private observeNoResults() {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            this.replaceNoResultsText(node);
          }
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private replaceNoResultsText(element: HTMLElement) {
    const text = element.textContent || '';
    const hasRawHtml = text.includes('<div') || text.includes('<br>') || text.includes('<a href');
    const hasNoResults = text.includes('No results found') || text.includes('Keine Ergebnisse') || text.includes('Ingen resultater');

    if (hasRawHtml || hasNoResults) {
      const translation = this.noResultsTranslations[this.currentLang] || this.noResultsTranslations['en'];
      element.textContent = translation;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
