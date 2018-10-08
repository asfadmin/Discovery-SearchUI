import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppStoreModule } from './store';
import { GranuleListModule } from './granule-list';

import { AppComponent } from './app.component';

import { AsfApiService } from './services/asf-api.service';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,

        AppStoreModule,
        GranuleListModule,
    ],
    providers: [ AsfApiService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
