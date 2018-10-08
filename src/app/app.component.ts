import { Component, OnInit } from '@angular/core';

import { Store, Action  } from '@ngrx/store';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from './store';
import { GranulesActions } from './store/actions';
import { getGranules, getRouterUrlState } from './store/reducers';

import { AsfApiService } from './services/asf-api.service';

import { SentinelGranule } from './models/sentinel-granule.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public granules$: Observable<SentinelGranule[]>;

    constructor(
        public store$: Store<AppState>,
        public asfApi: AsfApiService
    ) {}

    public ngOnInit() {
        this.granules$ = this.store$.select(getGranules);

        this.store$.select(getRouterUrlState).pipe(
            filter(s => !!s)
        ).subscribe(s => console.log(s));
    }

    public onLoadGranules(): void {
        this.store$.dispatch(new GranulesActions.LoadGranules());
    }

    public onClearGranules(): void {
        this.store$.dispatch(new GranulesActions.ClearGranules());
    }
}
