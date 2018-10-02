import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { GranuleListComponent } from './granule-list/granule-list.component';
import { GranuleComponent } from './granule-list/granule/granule.component';

import { environment } from '../environments/environment';
import { reducers, metaReducers } from './store/reducers';
import { appEffects } from './store/reducers/effects';

import { AsfApiService } from './services/asf-api.service';


@NgModule({
    declarations: [
        AppComponent,
        GranuleListComponent,
        GranuleComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot(appEffects),
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
    providers: [ AsfApiService ],
    bootstrap: [AppComponent]
})
export class AppModule { }
