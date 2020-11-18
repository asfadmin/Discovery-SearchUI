import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hyp3JobStatusCode } from '@models';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-job-status-selector',
  templateUrl: './job-status-selector.component.html',
  styleUrls: ['./job-status-selector.component.scss']
})

export class JobStatusSelectorComponent implements OnInit, OnDestroy {
  public selectedJobStatuses: Hyp3JobStatusCode[] = [];
  public jobStatuses = Object.keys(Hyp3JobStatusCode);
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getJobStatuses).subscribe(
        selected => {
          this.selectedJobStatuses = selected;
        }
      )
    );
  }

  public onNewJobStatusSelected(jobStatuses): void {
    this.store$.dispatch(new filtersStore.SetJobStatuses(jobStatuses));
  }

  public upperCaseFirst = (str: string, forceLower?: boolean): string => {
    if (forceLower) {
      str = str.toLowerCase();
    }
    return str.replace(/^\w/, chr => chr.toUpperCase());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
