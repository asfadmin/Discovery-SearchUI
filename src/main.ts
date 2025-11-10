import { enableProdMode, importProvidersFrom } from '@angular/core';
import { HttpLoaderFactory, routes } from './app/app.module';
import { environment } from './environments/environment';
import * as services from '@services';
import * as store from './app/store';
import { SAVER, getSaver } from '@services/saver.provider';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import { bootstrapApplication } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  NgcCookieConsentModule,
  NgcCookieConsentConfig,
} from 'ngx-cookieconsent';
import { withHashLocation, provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ToastrModule } from 'ngx-toastr';

const cookieConfig: NgcCookieConsentConfig = {
  autoOpen: false,
  cookie: {
    domain: window.location.hostname,
  },
  position: 'bottom',
  theme: 'edgeless',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#236192',
      text: '#ffffff',
      border: 'transparent',
    },
  },
  type: 'info',
  content: {
    message:
      'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Dismiss',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: 'https://cookiesandyou.com',
    policy: 'Cookie Policy',
  },
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      NgcCookieConsentModule.forRoot(cookieConfig),
      StoreModule.forRoot(store.reducers, { metaReducers: store.metaReducers }),
      EffectsModule.forRoot(store.appEffects),
      ToastrModule.forRoot({
        positionClass: 'inline',
        preventDuplicates: true,
      }),
    ),
    services.AsfApiService,
    services.AsfLanguageService,
    services.UrlStateService,
    services.MapService,
    services.DrawService,
    services.WktService,
    services.LayerService,
    services.ProductService,
    services.BulkDownloadService,
    services.SearchParamsService,
    services.RangeService,
    services.PolygonValidationService,
    services.DateExtremaService,
    services.EnvironmentService,
    services.PropertyService,
    services.LegacyAreaFormatService,
    services.BannerApiService,
    services.ScreenSizeService,
    services.KeyboardService,
    services.UserDataService,
    services.SavedSearchService,
    services.UnzipApiService,
    services.ScenesService,
    services.SearchService,
    services.Hyp3ApiService,
    services.Hyp3JobStatusService,
    services.Hyp3JobService,
    services.PossibleHyp3JobsService,
    services.OnDemandService,
    services.Hyp3JobPollingService,
    services.PairService,
    services.SceneSelectService,
    { provide: SAVER, useFactory: getSaver },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    provideAnimations(),
    provideRouter(routes, withHashLocation()),
  ],
}).catch((err) => console.error(err));
