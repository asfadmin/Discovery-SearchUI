import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import {
  StoreRouterConnectingModule,
  RouterReducerState,
  RouterStateSerializer,
} from '@ngrx/router-store';

import { environment } from '../environments/environment';
import { reducers, metaReducers, appEffects, CustomSerializer } from './store';

import { GranuleListModule } from './granule-list';
import { FiltersMenuModule } from './filters-menu';
import { MapModule } from './map';

import { AppComponent } from './app.component';
import { AsfApiService, RoutedSearchService } from './services';

export const routes = [
      { path: 'search/projection/:projection/filter/:filter', name: 'AppComponent', component: AppComponent },
      { path: '**', redirectTo: 'search/projection/equitorial/filter/other' }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    RouterModule.forRoot(routes, { useHash: true }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule,
    EffectsModule.forRoot(appEffects),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    GranuleListModule,
    FiltersMenuModule,
    MapModule
  ],
  providers: [
    AsfApiService,
    RoutedSearchService,
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
