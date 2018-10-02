import { Component, OnInit } from '@angular/core';

import { Store, Action  } from '@ngrx/store';

import { AppState } from './store/reducers';
import * as GranulesActions from './store/reducers/granules/action';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(public store$: Store<AppState>) {}

    public ngOnInit(): void {
        console.log('dispatching action...');
        this.store$.dispatch(new GranulesActions.LoadGranules());
    }
}
