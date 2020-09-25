import { Component, OnInit } from '@angular/core';

import { tap, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import * as services from '@services';

@Component({
  selector: 'app-hyp3-header',
  templateUrl: './hyp3-header.component.html',
  styleUrls: ['./hyp3-header.component.scss', '../header.component.scss']
})
export class Hyp3HeaderComponent implements OnInit {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
  ) { }

  ngOnInit(): void {
  }

  public onRefreshJobs(): void {
    this.store$.dispatch(new hyp3Store.LoadJobs());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }
}
