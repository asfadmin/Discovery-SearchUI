import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
        private store$: Store<AppState>,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    public ngOnInit() {
        this.granules$ = this.store$.select(fromReducers.getGranules);
        this.loading$ = this.store$.select(fromReducers.getLoading);
        this.error$ = this.store$.select(fromReducers.getError);
    }

    public onNewSearch(query: string) {
        const baseParams = {
            maxResults: 5,
            output: 'json'
        };

        const queryParams = {
            ...baseParams,
            ...parseQueryStringToDictionary(query)
        };

        this.router.navigate(['.'], { queryParams });
    }

    public onClearGranules(): void {
        this.router.navigate(['.'], { queryParams: {} });
        this.store$.dispatch(new GranulesActions.ClearGranules());
    }
}

function parseQueryStringToDictionary(queryString) {
    const dictionary = {};

    if (queryString.indexOf('?') === 0) {
        queryString = queryString.substr(1);
    }

    const parts = queryString.split('&');

    for (const p of parts) {
        const keyValuePair = p.split('=');

        const key = keyValuePair[0];
        let value = keyValuePair[1];

        value = decodeURIComponent(value);
        value = value.replace(/\+/g, ' ');

        dictionary[key] = value;
    }

    return dictionary;
}
