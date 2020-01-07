import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as store from './store';

import { NavBarModule } from '@components/nav-bar';
import { MapModule } from '@components/map';
import { ResultsMenuModule } from '@components/results-menu';
import { MatSharedModule } from '@shared';

import { CustomBreakPointsProvider } from '@services/custom-breakpoints.ts';

import * as services from '@services';

import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';

export const routes = [
  { path: '**', name: 'AppComponent', component: AppComponent },
];


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatSharedModule,
    FlexLayoutModule.withConfig({ disableDefaultBps: true },
      CustomBreakPointsProvider.useValue),
    RouterModule.forRoot(routes, { useHash: true }),
    StoreModule.forRoot(store.reducers, { metaReducers: store.metaReducers }),
    EffectsModule.forRoot(store.appEffects),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    MapModule,
    ResultsMenuModule,
    NavBarModule,
  ],
  providers: [
    services.AsfApiService,
    services.UrlStateService,
    services.MapService,
    services.DrawService,
    services.WktService,
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
    CustomBreakPointsProvider,
    services.UserDataService,
    services.SavedSearchService,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
