import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { GranuleListModule } from './granule-list/granule-list.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { reducers, metaReducers, appEffects } from './store';

import { AsfApiService } from './services/asf-api.service';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot(appEffects),
        !environment.production ? StoreDevtoolsModule.instrument() : [],

        GranuleListModule,
    ],
    providers: [ AsfApiService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
