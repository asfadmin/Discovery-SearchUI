import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers, metaReducers, appEffects } from './store';

import { GranuleListModule } from './granule-list';
import { FiltersMenuModule } from './filters-menu';
import { MapModule } from './map';

import { AsfApiService, RoutedSearchService, UrlStateService, MapService } from './services';
import { environment } from './../../../environments/environment';

import { FuseSharedModule } from '@fuse/shared.module';

import { SampleComponent } from './sample.component';

const routes = [{
  path     : 'sample',
  component: SampleComponent
}];

@NgModule({
  declarations: [
    SampleComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    BrowserModule,
    HttpClientModule,

    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(appEffects),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    TranslateModule,

    FuseSharedModule,

    GranuleListModule,
    FiltersMenuModule,
    MapModule,
  ],
  providers: [
    AsfApiService,
    RoutedSearchService,
    UrlStateService,
    MapService,
  ],
  exports: [
    SampleComponent
  ]
})
export class SampleModule {}
