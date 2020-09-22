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

  public projectNames: string[] = [];
  public projectName = '';

  constructor( private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.store$.select(hyp3Store.getHyp3User).pipe(
      tap(user => {
        if (user === null) {
          this.store$.dispatch(new hyp3Store.LoadUser());
        }
      })
    ).subscribe(user => {
      if (user) {
        this.projectNames = [ ...user.job_names, ];
      }
    });
  }

  public onRefreshJobs(): void {
    this.store$.dispatch(new hyp3Store.LoadJobs());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onProjectNameChange(projectName): void {
    this.projectName = projectName;
    this.store$.dispatch(new filtersStore.SetProjectName(
      projectName === '' ? null : projectName
    ));
  }
}
