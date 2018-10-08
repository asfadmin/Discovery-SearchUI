import { Component, OnInit } from '@angular/core';

import { Store, Action  } from '@ngrx/store';

import { AppState } from './store/reducers';
import { GranulesActions } from './store/actions';

import { AsfApiService } from './services/asf-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        public store$: Store<AppState>,
        public asfApi: AsfApiService
    ) {}

    public onLoadGranules(): void {
        this.store$.dispatch(new GranulesActions.LoadGranules());
    }

    public onClearGranules(): void {
        this.store$.dispatch(new GranulesActions.ClearGranules());
    }
}
