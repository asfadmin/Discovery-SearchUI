import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material';
import { environment } from '@environments/environment';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as store from './store';

import { SidebarModule } from '@components/sidebar';
import { SpreadsheetModule } from '@components/spreadsheet';
import { MapModule } from '@components/map';

import * as services from '@services';

import { AppComponent } from './app.component';


export const routes = [
  { path: '**', name: 'AppComponent', component: AppComponent },
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSnackBarModule,

    RouterModule.forRoot(routes, { useHash: true }),
    StoreModule.forRoot(store.reducers, { metaReducers: store.metaReducers }),
    EffectsModule.forRoot(store.appEffects),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    SidebarModule,
    SpreadsheetModule,
    MapModule,
  ],
  providers: [
    services.AsfApiService,
    services.UrlStateService,
    services.MapService,
    services.WktService,
    services.ProductService,
    services.BulkDownloadService,
    services.SearchParamsService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
