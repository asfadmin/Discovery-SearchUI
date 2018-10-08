import { Component, OnInit } from '@angular/core';

import { Store, Action  } from '@ngrx/store';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from './store';
import { GranulesActions } from './store/actions';
import * as fromReducers from './store/reducers';

import { AsfApiService } from './services/asf-api.service';

import { SentinelGranule } from './models/sentinel-granule.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public granules$: Observable<SentinelGranule[]>;
    public loading$: Observable<boolean>;
    public error$: Observable<string>;

    constructor(
        public store$: Store<AppState>,
        public asfApi: AsfApiService
    ) {}

    public ngOnInit() {
        this.granules$ = this.store$.select(fromReducers.getGranules);
        this.loading$ = this.store$.select(fromReducers.getLoading);
        this.error$ = this.store$.select(fromReducers.getError);

        this.store$.select(fromReducers.getRouterUrlState).pipe(
            filter(s => !!s)
        ).subscribe(s => console.log(s));
    }

    public onNewSearch(query: string) {
        this.store$.dispatch(new GranulesActions.QueryApi(query));
    }

    public onClearGranules(): void {
        this.store$.dispatch(new GranulesActions.ClearGranules());
    }
}
