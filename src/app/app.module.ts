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
import { SearchBarModule } from './search-bar';

import { AppComponent } from './app.component';
import { AsfApiService } from './services/asf-api.service';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,

        StoreModule.forRoot(reducers, { metaReducers }),
        RouterModule.forRoot([
            { path: 'search', component: AppComponent },
            { path: '**', redirectTo: 'search' }
        ], { useHash: true }),
        StoreRouterConnectingModule,
        EffectsModule.forRoot(appEffects),
        !environment.production ? StoreDevtoolsModule.instrument() : [],

        GranuleListModule,
        SearchBarModule
    ],
    providers: [ AsfApiService, { provide: RouterStateSerializer, useClass: CustomSerializer } ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
