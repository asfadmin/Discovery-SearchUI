// This file is used only for exporting utility functions and routes for the standalone app

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const routes = [
  { path: '**', name: 'AppComponent', component: AppComponent },
];
