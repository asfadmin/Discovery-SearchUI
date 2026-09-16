import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withHashLocation, provideRouter } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import {
  NgcCookieConsentModule,
  NgcCookieConsentConfig,
} from 'ngx-cookieconsent';
import { ToastrModule } from 'ngx-toastr';

import {
  AsfApiService,
  AsfLanguageService,
  UrlStateService,
  MapService,
  DrawService,
  WktService,
  LayerService,
  ProductService,
  BulkDownloadService,
  SearchParamsService,
  RangeService,
  PolygonValidationService,
  DateExtremaService,
  EnvironmentService,
  PropertyService,
  LegacyAreaFormatService,
  BannerApiService,
  ScreenSizeService,
  KeyboardService,
  UserDataService,
  SavedSearchService,
  ScenesService,
  SearchService,
  Hyp3ApiService,
  Hyp3JobStatusService,
  Hyp3JobService,
  PossibleHyp3JobsService,
  OnDemandService,
  Hyp3JobPollingService,
  PairService,
  SceneSelectService,
} from '@services';
import { SAVER, getSaver } from '@services/saver.provider';
import { appEffects } from '@store/app.effect';
import { metaReducers, reducers } from '@store/app.reducer';
import { StaticTranslateLoader } from 'src/translation';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.module';
import { environment } from './environments/environment';

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
    provideZoneChangeDetection(),
    importProvidersFrom(
      BrowserModule,
      NgcCookieConsentModule.forRoot(cookieConfig),
      MatBottomSheetModule,
      StoreModule.forRoot(reducers, { metaReducers: metaReducers }),
      EffectsModule.forRoot(appEffects),
      MatSidenavModule,
      MatTableModule,
      MatSortModule,
      MatMenuModule,
      MatFormFieldModule,
      MatIconModule,
      MatDialogModule,
      ToastrModule.forRoot({
        positionClass: 'inline',
        preventDuplicates: true,
      }),
    ),
    provideTranslateService({
      fallbackLang: 'en',
      loader: {
        provide: TranslateLoader,
        useClass: StaticTranslateLoader,
      },
    }),
    HttpClient, // remove in v21 w/ update to ngx-translate
    AsfApiService,
    AsfLanguageService,
    UrlStateService,
    MapService,
    DrawService,
    WktService,
    LayerService,
    ProductService,
    BulkDownloadService,
    SearchParamsService,
    RangeService,
    PolygonValidationService,
    DateExtremaService,
    EnvironmentService,
    PropertyService,
    LegacyAreaFormatService,
    BannerApiService,
    ScreenSizeService,
    KeyboardService,
    UserDataService,
    SavedSearchService,
    ScenesService,
    SearchService,
    Hyp3ApiService,
    Hyp3JobStatusService,
    Hyp3JobService,
    PossibleHyp3JobsService,
    OnDemandService,
    Hyp3JobPollingService,
    PairService,
    SceneSelectService,
    { provide: SAVER, useFactory: getSaver },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes, withHashLocation()),
  ],
}).catch((err) => console.error(err));
