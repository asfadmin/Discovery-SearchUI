import { Component, OnInit } from '@angular/core';

import { Store, Action  } from '@ngrx/store';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from './store';
import { GranulesActions } from './store/actions';
import * as fromReducers from './store/reducers';

import { AsfApiService, RoutedSearchService } from './services';

import { SentinelGranule } from './models';

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
        private routedSearchService: RoutedSearchService,
        private store$: Store<AppState>) {}

    public ngOnInit() {
        this.granules$ = this.store$.select(fromReducers.getGranules);
        this.loading$ = this.store$.select(fromReducers.getLoading);
        this.error$ = this.store$.select(fromReducers.getError);
    }

    public onNewSearch(query: string): void {
        this.routedSearchService.query(query);
    }

    public onClearGranules(): void {
        this.routedSearchService.clear();
        this.store$.dispatch(new GranulesActions.ClearGranules());
    }

}

