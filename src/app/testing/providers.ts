import { provideMockStore } from '@ngrx/store/testing';
import { initState as filtersInit } from '@store/filters/filters.reducer';
import { initState as scenesInit } from '@store/scenes/scenes.reducer';
import { initState as userInit } from '@store/user/user.reducer';
import { initState as queueInit } from '@store/queue/queue.reducer';
import { initState as hyp3Init } from '@store/hyp3/hyp3.reducer';
import { initState as searchInit } from '@store/search/search.reducer';

import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';

import { TranslateLoader } from '@ngx-translate/core';
import { StaticTranslateLoader } from 'src/translation';

const testProviders: (Provider | EnvironmentProviders)[] = [
  provideHttpClientTesting(),
  provideMockStore({
    initialState: {
      filters: filtersInit,
      scenes: scenesInit,
      user: userInit,
      queue: queueInit,
      hyp3: hyp3Init,
      search: searchInit,
    },
  }),
  provideHttpClient(),
  provideTranslateService(),

  provideTranslateService({
    fallbackLang: 'en',
    loader: {
      provide: TranslateLoader,
      useClass: StaticTranslateLoader,
    },
  }),
];

export default testProviders;
